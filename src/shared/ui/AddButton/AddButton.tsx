import { memo } from "react";
import { PlusIcon } from "../_SVG";
import cls from "./AddButton.module.scss";
import { classNames } from "../../lib/classNames/classNames";

interface AddButtonProps {
    className?: string;
    onClick: () => void;
}

export const AddButton = memo((props: AddButtonProps) => {
    const { className, onClick } = props;

    return (
        <button
            type="button"
            className={classNames(cls.AddButton, [className])}
            onClick={onClick}
        >
            <PlusIcon />
        </button>
    );
});
