import {
    KeyboardEvent, memo, useCallback, useEffect, useRef, useState
} from "react";
import { ChevronIcon } from "../../ui/_SVG";
import cls from "./DropDown.module.scss";

interface OptionProps {
    value: string;
    label: string;
}

interface DropDownProps {
    options: OptionProps[];
    value?: string;
    placeholder?: string;
    onChange: (value: string) => void;
}

const DropDown = memo((props: DropDownProps) => {
    const {
        options,
        value,
        placeholder = "Select an option",
        onChange,
        ...otherProps
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find((option) => option.value === value);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleOptionSelect = (value: string) => {
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
            className={cls.DropdownContainer}
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
                <span>{selectedOption?.label || placeholder}</span>
                <ChevronIcon width="24px" height="24px" />
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
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
});

export default DropDown;
