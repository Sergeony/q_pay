import { ReactNode, FC } from "react";

import { CrossIcon } from "shared/ui/_SVG";
import cls from "./Modal.module.scss";

interface ModalProps {
    showClose?: boolean;
    onClose?: () => void;
    children: ReactNode;
}

export const Modal: FC<ModalProps> = (props) => {
    const {
        showClose = true,
        onClose,
        children,
    } = props;

    return (
        <div className={cls.ModalOverlay}>
            <div className={cls.ModalContainer}>
                {
                    showClose
                    && (
                        <button
                            type="button"
                            onClick={onClose}
                            className={cls.CloseButton}
                        >
                            <CrossIcon />
                        </button>
                    )
                }
                {children}
            </div>
        </div>
    );
};
