import { memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Input } from "shared/ui/Input/Input";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { CopyIcon } from "shared/ui/_SVG";
import { getRouteVerifyTotp } from "shared/const/router";
import { handleCopyToClipboard } from "shared/lib/utils/utils";
import { getAuthTotpSecret } from "../model/selectors/getAuthTotpSecret";
import cls from "./Auth.module.scss";

export const SetupTotpForm = memo(() => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const totpSecret = useSelector(getAuthTotpSecret);

    const onSubmit = useCallback(() => {
        navigate(getRouteVerifyTotp());
    }, [navigate]);

    return (
        <>
            <div>
                <h2>{t("setup_totp_page_title")}</h2>
            </div>
            <div>
                <p>{t("setup_totp_page_description")}</p>
                <form className={cls.VerifyTotpForm} onSubmit={onSubmit}>
                    <Button
                        role={ButtonRole.CLEAR}
                        className="custom-field"
                        onClick={() => handleCopyToClipboard(totpSecret)}
                    >
                        <CopyIcon />
                        <Input
                            readOnly
                            id="totpSecret"
                            name="totpSecret"
                            type="text"
                            value={totpSecret}
                        />
                    </Button>
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
