import { Trans, useTranslation } from "react-i18next";
import { getUserData } from "entities/User";
import { memo, useCallback } from "react";
import { CopyIcon } from "shared/ui/_SVG";
import { useSelector } from "react-redux";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";

export const TabGeneral = memo(() => {
    const { t } = useTranslation();
    const userData = useSelector(getUserData);

    const logout = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        location.reload();
    }, []);

    if (!userData) return null;

    return (
        <div className="v-stack gap-24 w-fit">
            <section className="v-stack gap-16">
                <h3 className="h3">{t("Электронная почта")}</h3>
                <div className="v-stack gap-8">
                    {/* TODO: replace with email */}
                    <span className="accent-fg text-main-bold">{userData.id}</span>
                    <p className="col-h">
                        {t("change_email_description")}
                    </p>
                </div>
            </section>
            <select>
                <option value={1} label="GMT+0" />
                <option value={2} label="GMT+1" />
                <option value={3} label="GMT+2" />
                <option value={4} label="GMT+3" />
                <option value={5} label="GMT+4" />
                <option value={6} label="GMT+5" />
                <option value={7} label="GMT+6" />
                <option value={8} label="GMT+7" />
                <option value={9} label="GMT+8" />
                <option value={1} label="GMT+9" />
                <option value={1} label="GMT+10" />
                <option value={1} label="GMT+11" />
            </select>
            <section className="v-stack gap-16">
                <h3 className="h3">{t("Адрес пополнения баланса")}</h3>
                <div className="v-stack">
                    <strong className="danger-fg bold line-height-1-5">
                        <Trans i18nKey="usdt_deposit_description" />
                    </strong>
                </div>
                <div className="h-stack gap-4">
                    <input readOnly value="TYRJxtS4j1PQKUjY1KUsgX5ECV2N5hKimW" />
                    <CopyIcon />
                </div>
            </section>
            <Button
                role={ButtonRole.CANCEL}
                onClick={logout}
                className="w-fit"
            >
                {t("logout_button")}
            </Button>
        </div>
    );
});
