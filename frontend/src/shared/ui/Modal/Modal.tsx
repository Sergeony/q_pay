import {
    FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState
} from "react";

import { VStack } from "../Stack";
import { Button } from "../Button/Button";
import { CrossIcon } from "../_SVG";
import { classNames, Modes } from "../../lib/classNames/classNames";
import { Portal } from "../Portal/Portal";
import cls from "./Modal.module.scss";

interface ModalProps {
    hasCloseBtn?: boolean;
    onClose?: () => void;
    children: ReactNode;
    isOpen: boolean;
    isLazy?: boolean;
}

const MODAL_CLOSE_DELAY = 300;

// FIXME: add animation on first open(when modal is being mounted)
export const Modal: FC<ModalProps> = (props) => {
    const {
        hasCloseBtn = true,
        onClose,
        children,
        isOpen,
        isLazy = false,
    } = props;

    const [isClosing, setIsClosing] = useState(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
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
            setIsMounted(true);
            window.addEventListener("keydown", onKeyDown);
            document.addEventListener("mousedown", onClickOutside);
        }
        return () => {
            if (timerRef?.current) {
                clearTimeout(timerRef.current);
            }
            window.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [handleClose, isOpen]);

    const mods: Modes = useMemo(() => ({
        [cls.isOpen]: isOpen,
        [cls.isClosing]: isClosing,
    }), [isOpen, isClosing]);

    if (isLazy && !isMounted) {
        return null;
    }

    return (
        <Portal>
            <VStack
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
            </VStack>
        </Portal>
    );
};
