import React, {
    memo, useCallback, useEffect, useRef, useState
} from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonRole } from "../Button/Button";
import { DeleteIcon, EditIcon, KebabMenuIcon } from "../_SVG";
import cls from "./KebabMenu.module.scss";

interface KebabMenuProps {
    onEdit?: () => void;
    onDelete?: () => void;
}

const KebabMenu = memo((props: KebabMenuProps) => {
    const {
        onEdit,
        onDelete,
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    const onClick = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    }, [isOpen]);

    const handleOptionClick = useCallback((
        event: React.MouseEvent<HTMLElement, MouseEvent>,
        handler: () => void
    ) => {
        onClick(event);
        handler();
    }, [onClick]);

    return (
        <div ref={menuRef} className={cls.KebabMenu}>
            <Button role={ButtonRole.CLEAR} onClick={onClick}>
                <KebabMenuIcon />
            </Button>
            {isOpen && (
                <div>
                    {onEdit && (
                        <Button
                            onClick={(event) => { handleOptionClick(event, onEdit); }}
                            role={ButtonRole.CLEAR}
                        >
                            <EditIcon className={cls.EditIcon} />
                            <span>{t("kebab_menu_option_edit")}</span>
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            onClick={(event) => { handleOptionClick(event, onDelete); }}
                            role={ButtonRole.CLEAR}
                        >
                            <DeleteIcon className={cls.DeleteIcon} />
                            <span>{t("kebab_menu_option_delete")}</span>
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
});

export default KebabMenu;
