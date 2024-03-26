import {
    ChangeEvent, FunctionComponent, InputHTMLAttributes, memo, SVGAttributes
} from "react";
import { Button, ButtonRole } from "../Button/Button";
import CheckIcon from "../_SVG/icons/CheckIcon";
import { CrossIcon } from "../_SVG";
import cls from "./Field.module.scss";

type InputAttrs = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

type Requirements = Record<string, boolean>;

export enum FieldVariant {
    STANDARD = "standard",
    SECURE = "secure",
}

interface ExtendedFieldProps extends InputAttrs {
    variant?: FieldVariant;
    className?: string;
    value?: string | number;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    Icon?: FunctionComponent<SVGAttributes<SVGElement>>;
    onIconClick?: () => void;
    error?: string | boolean;
    label: string;
    hideLabel?: true;
    requirements?: Requirements;
}

export const Field = memo((props: ExtendedFieldProps) => {
    const {
        variant = FieldVariant.STANDARD,
        className,
        value,
        onChange,
        label,
        hideLabel,
        type = "text",
        id,
        Icon,
        onIconClick,
        error,
        requirements,
        ...otherProps
    } = props;

    return (
        <div className="v-stack gap-8">
            <label
                htmlFor={id}
                className={hideLabel && cls.hidden}
            >
                {label}
            </label>
            <div className="pos-rel">
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    className={`${cls[variant]} ${Icon && cls.WithIcon} ${className}`}
                    id={id}
                    {...otherProps}
                />
                {Icon && (
                    <Button
                        role={ButtonRole.CLEAR}
                        className={`pos-abs ${cls.IconButton}`}
                        onClick={onIconClick}
                    >
                        <Icon />
                    </Button>
                )}
            </div>
            {requirements && (
                <ul className={cls.Requirements}>
                    {Object.entries(requirements).map(([requirement, checked]) => (
                        <li key={requirement}>
                            {checked
                                ? <CheckIcon className="accent-fill" />
                                : <CrossIcon className="danger-fill" />}
                            <span>{requirement}</span>
                        </li>
                    ))}
                </ul>
            )}
            {error && <span className="text-main-bold danger-fg">{error}</span>}
        </div>
    );
});
