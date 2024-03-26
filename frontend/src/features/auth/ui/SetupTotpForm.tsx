import { memo, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { CopyIcon } from "shared/ui/_SVG";
import { getRouteNotFound, getRouteVerifyTotp } from "shared/const/router";
import { handleCopyToClipboard } from "shared/lib/utils/utils";
import { Field, FieldVariant } from "shared/ui/Field/Field";
import QRCode from "qrcode.react";
import { getAuthEmail } from "../model/selectors/getAuthEmail";
import { getAuthTotpSecret } from "../model/selectors/getAuthTotpSecret";
import cls from "./Auth.module.scss";

export const SetupTotpForm = memo(() => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const totpSecret = useSelector(getAuthTotpSecret);
    const email = useSelector(getAuthEmail);

    const onSubmit = useCallback(() => {
        navigate(getRouteVerifyTotp());
    }, [navigate]);

    useEffect(() => {
        if (!totpSecret) {
            navigate(getRouteNotFound());
        }
    }, [navigate, totpSecret]);

    return (
        <main className={cls.main}>
            <section aria-labelledby="setup-totp-heading" className="v-stack gap-32">
                <h1 id="setup-totp-heading" className="PageTitle">
                    {t("setup_totp_page_title")}
                </h1>
                <p className={cls.PageDescription}>{t("setup_totp_page_description")}</p>
                <div className={cls.QRContainer}>
                    <QRCode
                        value={
                            "otpauth://totp/"
                            + `${encodeURIComponent("QPay")}:`
                            + `${encodeURIComponent(email)}?`
                            + `secret=${totpSecret}&`
                            + `issuer=${encodeURIComponent("QPay")}`
                        }
                        renderAs="svg"
                        level="L"
                        bgColor="transparent"
                        fgColor="var(--grey-contrast)"
                        size={200}
                    />
                    <span>Q</span>
                </div>
                <form
                    onSubmit={onSubmit}
                    className="v-stack gap-32 w-full"
                >
                    <Field
                        variant={FieldVariant.SECURE}
                        label={t("totp_secret_label")}
                        hideLabel
                        value={totpSecret}
                        readOnly
                        id="totpSecret"
                        name="totpSecret"
                        type="text"
                        Icon={CopyIcon}
                        onIconClick={() => handleCopyToClipboard(totpSecret)}
                        className="accent-fg"
                    />
                    <Button
                        type="submit"
                        role={ButtonRole.PRIMARY}
                    >
                        {t("totp_secret_saved_btn")}
                    </Button>
                </form>
            </section>
        </main>
    );
});
