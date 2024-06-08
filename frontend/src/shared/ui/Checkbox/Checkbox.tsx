import { ChangeEvent, InputHTMLAttributes, memo } from "react";
import cls from "./Checkbox.module.scss";

type InputAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

interface CheckboxProps extends InputAttrs {
    value: boolean;
    onChange: (event: ChangeEvent) => void;
    label: string;
}

export const Checkbox = memo((props: CheckboxProps) => {
    const {
        value,
        onChange,
        label,
        ...otherProps
    } = props;

    return (
        <div className="h-stack gap-8 alignCenter">
            <input
                type="checkbox"
                checked={value}
                onChange={onChange}
                className={cls.checkbox}
                {...otherProps}
            />
            <label htmlFor="agreeTerms" className={cls.label}>
                {label}
            </label>
        </div>
    );
});
