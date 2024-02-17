import logging
import time

from django.db.models.signals import pre_save, post_save
from django.db.transaction import atomic
from django.dispatch import receiver
from django.db import transaction, OperationalError
from django.utils import timezone
from django.conf import settings

from main.services import (
    update_balances_on_successful_transaction,
    release_user_balance_for_transaction,
    update_balance_on_refunded_transaction,
    freeze_user_balance_for_transaction,
    update_balances_on_redirect_transaction,
    notify_user_on_transaction_update,
    notify_user_on_balance_update,
)
from main.models import (
    User,
    Balance,
    Transaction,
    TransactionStatusHistory,
    BalanceHistory,
)
from api.tasks import notify_merchant_with_new_transaction_status


logger = logging.getLogger(__name__)


@receiver(post_save, sender=User)
def create_user_balance_on_user_create(sender, instance: User, created, **kwargs):
    """
    Create a new balance when a new user is created

    - It is intended for use by non-admin users only (traders and merchants).
    - The admin users have a separate balance storage logic.
    """
    if created:
        user = instance if instance.type != instance.Type.ADMIN else None
        with atomic():
            Balance.objects.create(user=user)
            BalanceHistory.objects.create(
                user=user,
                new_active_balance=0.00,
                new_frozen_balance=0.00,
                change_reason=BalanceHistory.ChangeReason.CREATED
            )


@receiver(post_save, sender=Balance)
def send_balance_on_balance_update(sender, instance: Balance, **kwargs):
    notify_user_on_balance_update(instance)


@receiver(post_save, sender=User)
def create_merchant_integrations_on_merchant_create(sender, instance: User, created, **kwargs):
    """
    Create a new integration when a new merchant is created

    - It is intended for use by merchants only.
    """
    if instance.type == instance.Type.MERCHANT and created:
        Balance.objects.create(user=instance.id)


@receiver(post_save, sender=Transaction)
def update_transaction_history_on_transaction_update(sender, instance: Transaction, **kwargs):
    """
    Perform actions after successful transaction status update

    - Update the transaction history.
    - Notify admin if the transaction goes to dispute status.
    - Notify trader if assigned (always, except rejected status).
    - Notify merchant on every single update.
    """
    TransactionStatusHistory.objects.create(
        transaction=instance,
        status=instance.status,
        changed_at=timezone.now()
    )
    if instance.status == instance.Status.DISPUTING:
        notify_user_on_transaction_update(instance, is_admin=True)
    if instance.trader:
        notify_user_on_transaction_update(instance)
    notify_merchant_with_new_transaction_status(instance)


@receiver(pre_save, sender=Transaction)
def handle_transaction_status_update(sender, instance: Transaction, **kwargs):
    """
    Perform actions before transaction status update

    - Update the user balances. Omit cases where the transaction goes into:
        review, dispute, reject, refunding, refund failed statuses as it does not affect the balances.

    - Try to perform the actions a specified number of times if it fails, then raise an exception.

    - Raise an exception if there is no old trader specified for the transaction redirect.

    TODO: Consider to handle the cases when the transaction goes into refund failed.
        Perhaps, to move the amount to be refunded from the trader's frozen balance to the admin or to the merchant.
    """
    if instance.status in [instance.Status.REVIEWING,
                           instance.Status.DISPUTING,
                           instance.Status.REFUNDING,
                           instance.Status.REJECTED,
                           instance.Status.REFUND_FAILED]:
        return

    for attempt in range(settings.MAX_TRANSACTION_STATUS_UPDATE_ATTEMPTS):
        try:
            with transaction.atomic():
                sender_user = instance.trader if instance.type == instance.Type.DEPOSIT else instance.merchant
                sender_balance = Balance.objects.get(user=sender_user)
                if instance.Status == instance.Status.REDIRECT:
                    update_balances_on_redirect_transaction(sender_balance, instance)
                elif instance.status == instance.Status.PENDING:
                    freeze_user_balance_for_transaction(sender_balance, instance)
                elif instance.status in [instance.Status.COMPLETED,
                                         instance.Status.PARTIAL,
                                         instance.Status.REFUND_REQUESTED]:
                    update_balances_on_successful_transaction(sender_balance, instance)
                elif instance.status in [instance.Status.CANCELLED,
                                         instance.Status.FAILED]:
                    release_user_balance_for_transaction(sender_balance, instance)
                elif instance.status == Transaction.Status.REFUNDED:
                    update_balance_on_refunded_transaction(sender_balance, instance)
                break
        except OperationalError as e:
            message = f"Transaction ID: {instance.id} update failed after {attempt + 1} attempts."
            if attempt < settings.MAX_TRANSACTION_STATUS_UPDATE_ATTEMPTS - 1:
                logger.warning(f"{message} Retrying...")
                time.sleep(2 ** attempt)
            else:
                logger.critical(message)
                raise OperationalError(message, e)
        except ValueError as e:
            message = f"Transaction ID: {instance.id} old trader was not found to perform redirect."
            logger.error(message)
            raise OperationalError(message, e)
