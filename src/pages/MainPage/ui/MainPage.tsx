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
            <Modal isLazy isOpen={modalIsOpen} onClose={handleClick}>
                {/* eslint-disable-next-line */}
                <div>
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut,
                    cupiditate eveniet exercitationem ipsa maiores placeat rem vel?
                    Aut distinctio eum excepturi labore libero voluptatem?
                    Amet libero quam saepe ullam voluptatem.
                </div>
            </Modal>
            <SignInForm />
        </div>
    );
};
