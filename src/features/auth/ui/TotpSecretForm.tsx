import { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { CopyIcon } from "shared/ui/_SVG";
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import { getTotpBase32 } from "../model/selectors/getSignInFormPassword";
import cls from "./Auth.module.scss";

export const TotpSecretForm = memo(() => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const totpSecret = useSelector(getTotpBase32);

    const onSubmit = useCallback(() => {
        navigate(RoutePath.verify_totp);
    }, [navigate]);

    const copyCode = async () => {
        await navigator.clipboard.writeText(totpSecret);
    };

    return (
        <>
            <div>
                <h2>{t("Верификация")}</h2>
            </div>
            <div>
                <p>{t("save_totp_secret")}</p>
                <form className={cls.VerifyTotpForm} onSubmit={onSubmit}>
                    <div className="custom-field" onClick={copyCode}>
                        <CopyIcon />
                        <Input
                            readOnly
                            id="totpSecret"
                            name="totpSecret"
                            type="text"
                            value={totpSecret}
                        />
                    </div>
                    <Button
                        type="submit"
                        role={ButtonRole.PRIMARY}
                    >
                        {t("totp_secret_saved_btn")}
                    </Button>
                </form>
            </div>
        </>
    );
});
