import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { Modal } from "shared/ui/Modal/Modal";
import { SignInForm } from "features/auth";

export const MainPage = () => {
    const { t } = useTranslation();
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const handleClick = () => {
        setModalIsOpen((prev) => !prev);
    };

    return (
        <div style={{ height: "560px" }}>
            <Button onClick={handleClick} role={ButtonRole.PRIMARY}>{t("Open!")}</Button>
            {modalIsOpen && (
                <Modal isLazy isOpen={modalIsOpen} onClose={handleClick}>
                    {/* eslint-disable-next-line */}
                    <SignInForm />
                </Modal>
            )}
        </div>
    );
};
