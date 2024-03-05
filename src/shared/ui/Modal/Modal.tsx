import {
    FC, ReactNode, useCallback, useEffect, useRef, useState
} from "react";

import { Button } from "shared/ui/Button/Button";
import { CrossIcon } from "shared/ui/_SVG";
import { classNames } from "shared/lib/classNames/classNames";
import { Portal } from "shared/ui/Portal/Portal";
import cls from "./Modal.module.scss";

interface ModalProps {
    hasCloseBtn?: boolean;
    onClose?: () => void;
    children: ReactNode;
    isOpen: boolean;
}

const MODAL_CLOSE_DELAY = 300;

export const Modal: FC<ModalProps> = (props) => {
    const {
        hasCloseBtn = true,
        onClose,
        children,
        isOpen,
    } = props;

    const [isClosing, setIsClosing] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleClose = useCallback(() => {
        if (onClose) {
            setIsClosing(true);
            timerRef.current = setTimeout(() => {
                setIsClosing(false);
                onClose();
            }, MODAL_CLOSE_DELAY);
        }
    }, [onClose]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                handleClose();
            }
        };
        const onClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };
        if (isOpen) {
            window.addEventListener("keydown", onKeyDown);
            document.addEventListener("mousedown", onClickOutside);
        }
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            window.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [handleClose, isOpen]);

    const mods = {
        [cls.isOpen]: isOpen,
        [cls.isClosing]: isClosing,
    };

    return (
        <Portal>
            <div
                data-testid="modal"
                className={classNames(cls.overlay, [], mods)}
            >
                <div
                    className={cls.container}
                    ref={containerRef}
                >
                    {hasCloseBtn && (
                        <Button
                            data-testid="close-button"
                            className={cls.closeButton}
                            onClick={handleClose}
                            aria-label="Close modal"
                        >
                            <CrossIcon />
                        </Button>
                    )}
                    {children}
                </div>
            </div>
        </Portal>
    );
};
