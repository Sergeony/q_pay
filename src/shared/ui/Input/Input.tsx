import {
    ChangeEvent, InputHTMLAttributes, memo, useCallback
} from "react";
import { classNames } from "shared/lib/classNames/classNames";
import cls from "./Input.module.scss";

type InputAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

interface InputProps extends InputAttrs {
    value?: string | number,
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Input = memo((props: InputProps) => {
    const {
        value,
        onChange,
        type = "text",
        ...otherProps
    } = props;

    // const onChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    //     onChange?.(event.target.value);
    // }, [onChange]);

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            className={classNames(cls.Input)}
            {...otherProps}
        />
    );
});
