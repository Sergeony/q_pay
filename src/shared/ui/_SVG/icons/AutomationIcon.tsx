import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => {
    const { useGradient, ...otherProps } = props;

    return (
        <Svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...otherProps}
        >
            <defs>
                <linearGradient
                    id="paint0_linear_1120_14473"
                    x1="8.42"
                    y1="2.08"
                    x2="12"
                    y2="5.72"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3F9AEF" />
                    <stop offset="1" stopColor="#7BFFE7" />
                </linearGradient>
                <linearGradient
                    id="paint1_linear_1120_14473"
                    x1="8.68"
                    y1="8.24"
                    x2="18.9426"
                    y2="22.1529"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3F9AEF" />
                    <stop offset="1" stopColor="#7BFFE7" />
                </linearGradient>
                <linearGradient
                    id="paint2_linear_1120_14473"
                    x1="8.1"
                    y1="10.54"
                    x2="8.44877"
                    y2="14.0862"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#3F9AEF" />
                    <stop offset="1" stopColor="#7BFFE7" />
                </linearGradient>
            </defs>
            <path
                d="M8.00004 5.33366V2.66699H5.33337"
                stroke={useGradient ? "url(#paint0_linear_1120_14473)" : "#46404B"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.0001 5.33398H4.00008C3.2637 5.33398 2.66675 5.93094 2.66675 6.66732V12.0007C2.66675 12.737 3.2637 13.334 4.00008 13.334H12.0001C12.7365 13.334 13.3334 12.737 13.3334 12.0007V6.66732C13.3334 5.93094 12.7365 5.33398 12.0001 5.33398Z"
                stroke={useGradient ? "url(#paint1_linear_1120_14473)" : "#46404B"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M1.33337 9.33366H2.66671M13.3334 9.33366H14.6667M10 8.66699V10.0003M6.00004 8.66699V10.0003"
                stroke={useGradient ? "url(#paint2_linear_1120_14473)" : "#46404B"}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};

export default Icon;
