import { classNames } from "shared/lib/classNames/classNames";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Modal } from "shared/ui/Modal/Modal";

interface MainPageProps {
    className?: string;
}

export const MainPage = ({ className }: MainPageProps) => {
    const { t } = useTranslation();

    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const handleClick = () => {
        setModalIsOpen((prev) => !prev);
    };

    return (
        <div className={classNames("", [className], {})}>
            <Button onClick={handleClick} role={ButtonRole.PRIMARY}>{t("Open!")}</Button>
            <Modal isOpen={modalIsOpen} onClose={handleClick}>
                {/* eslint-disable-next-line */}
                <div>
                    {/* eslint-disable-next-line i18next/no-literal-string */}
                    {/* eslint-disable-next-line */}
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut, cupiditate eveniet exercitationem ipsa maiores placeat rem vel? Aut distinctio eum excepturi labore libero voluptatem? Amet libero quam saepe ullam voluptatem.
                </div>
            </Modal>
        </div>
    );
};
