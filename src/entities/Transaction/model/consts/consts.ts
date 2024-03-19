export enum TransactionType {
    DEPOSIT = 1,
    WITHDRAWAL = 2,
}

export enum TransactionStatus {
    REJECTED = 1,
    PENDING = 2,
    CANCELLED = 3,
    REVIEWING = 4,
    DISPUTING = 5,
    COMPLETED = 6,
    FAILED = 7,
    PARTIAL = 8,
    REFUND_REQUESTED = 9,
    REFUNDING = 10,
    REFUNDED = 11,
    REFUND_FAILED = 12,
    REDIRECT = 13,
}

export const TransactionStatusRepr: Record<TransactionStatus, string> = {
    [TransactionStatus.REJECTED]: "rejected",
    [TransactionStatus.PENDING]: "pending",
    [TransactionStatus.CANCELLED]: "cancelled",
    [TransactionStatus.REVIEWING]: "reviewing",
    [TransactionStatus.DISPUTING]: "disputing",
    [TransactionStatus.COMPLETED]: "completed",
    [TransactionStatus.FAILED]: "failed",
    [TransactionStatus.PARTIAL]: "partial",
    [TransactionStatus.REFUND_REQUESTED]: "refund_requested",
    [TransactionStatus.REFUNDING]: "refunding",
    [TransactionStatus.REFUNDED]: "refunded",
    [TransactionStatus.REFUND_FAILED]: "refund_failed",
    [TransactionStatus.REDIRECT]: "redirect",
};

export const ACTIVE_TRANSACTION_STATUSES = [
    TransactionStatus.PENDING,
    TransactionStatus.REVIEWING
];

export enum TransactionStatusGroup {
    ACTIVE = "active",
    COMPLETED = "completed",
    DISPUTED = "disputed",
    CHECKING = "checking",
}
