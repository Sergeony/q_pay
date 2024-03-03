import { ReactNode, FC } from "react";

import { Button } from "shared/ui/Button/Button";
import { CrossIcon } from "shared/ui/_SVG";
import cls from "./Modal.module.scss";

interface ModalProps {
    hideClose?: boolean;
    onClose?: () => void;
    children: ReactNode;
}

export const Modal: FC<ModalProps> = (props) => {
    const {
        hideClose = false,
        onClose,
        children,
    } = props;

    return (
        <div
            data-testid="modal"
            className={cls.ModalOverlay}
        >
            <div className={cls.ModalContainer}>
                {
                    !hideClose
                    && (
                        <Button
                            data-testid="close-button"
                            type="button"
                            onClick={onClose}
                            className={cls.CloseButton}
                        >
                            <CrossIcon />
                        </Button>
                    )
                }
                {children}
            </div>
        </div>
    );
};
