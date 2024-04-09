import {
    HTMLAttributes, KeyboardEvent, memo, ReactNode, useCallback, useEffect, useRef, useState
} from "react";
import { ChevronIcon } from "../../ui/_SVG";
import cls from "./DropDown.module.scss";

interface WithIconProps {
    text: string;
    icon: ReactNode;
}

interface OptionProps<T> {
    value: T;
    content: string | WithIconProps;
}

type InputAttrs = Omit<HTMLAttributes<HTMLDivElement>, "value" | "onChange">;

interface DropDownProps<T> extends InputAttrs {
    options: OptionProps<T>[];
    value?: T;
    placeholder?: string;
    onChange: (value: T) => void;
    name?: string;
}

const genericMemo: <T>(component: T) => T = memo;

const DropDown = genericMemo(<T extends string | number>(props: DropDownProps<T>) => {
    const {
        options,
        value,
        placeholder = "Select an option",
        onChange,
        className,
        ...otherProps
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleOptionSelect = (value: T) => {
        onChange(value);
        setIsOpen(false);
    };

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === " " || event.key === "Enter") {
            setIsOpen(!isOpen);
            if (isOpen && selectedOption) {
                onChange(selectedOption.value);
            }
        } else if (event.key === "Escape") {
            setIsOpen(false);
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            const newIndex = Math.min(
                options.findIndex((option) => option.value === value) + 1,
                options.length - 1
            );
            onChange(options[newIndex].value);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            const newIndex = Math.max(
                options.findIndex((option) => option.value === value) - 1,
                0
            );
            onChange(options[newIndex].value);
        }
    }, [isOpen, onChange, options, selectedOption, value]);

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", onClickOutside);
        }
        return () => {
            if (isOpen) {
                document.removeEventListener("mousedown", onClickOutside);
            }
        };
    });

    return (
        <div
            className={`${cls.DropdownContainer} ${className}`}
            tabIndex={0}
            role="button"
            aria-haspopup="true"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            ref={containerRef}
            {...otherProps}
        >
            <div className={`${cls.Header} ${isOpen && cls.Open} ${!value && cls.Placeholder}`}>
                {typeof selectedOption?.content !== "string" && selectedOption?.content?.icon}
                <span>
                    {
                        typeof selectedOption?.content === "string"
                            ? selectedOption?.content
                            : selectedOption?.content?.text || placeholder
                    }
                </span>
                <ChevronIcon className={cls.ChevronIcon} width="16px" height="16px" />
            </div>
            {isOpen && (
                <ul className={cls.Options}>
                    {options.filter((option) => option.value !== value).map((option) => (
                        <li
                            key={option.value}
                            className={cls.Option}
                            tabIndex={0}
                            role="option"
                            aria-selected={value === option.value}
                            onClick={() => handleOptionSelect(option.value)}
                        >
                            {typeof option.content !== "string" && option.content.icon}
                            {typeof option.content === "string"
                                ? option.content
                                : option.content.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default DropDown;
