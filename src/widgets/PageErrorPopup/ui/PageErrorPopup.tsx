import { FC } from "react";

import { useTranslation } from "react-i18next";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { Modal } from "shared/ui/Modal/Modal";
import cls from "./PageErrorPopup.module.scss";

export const PageErrorPopup: FC = () => {
    const { t } = useTranslation();

    const reloadPage = () => {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
    };

    return (
        <Modal isOpen isLazy hasCloseBtn={false}>
            <div className={cls.PageErrorPopup}>
                <p>{t("unexpected_error")}</p>
                <Button
                    onClick={reloadPage}
                    role={ButtonRole.PRIMARY}
                    width="300px"
                >
                    {t("reload_page")}
                </Button>
            </div>
        </Modal>
    );
};
