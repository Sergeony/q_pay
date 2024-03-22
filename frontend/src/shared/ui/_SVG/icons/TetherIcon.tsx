import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => (
    <Svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path d="M3 2H13V4.38H3V2ZM9.5 8.76V14.01H6.5V8.76H9.5Z" />
        <path
            d="M7.99988 5.75C4.33988 5.75 1.37988 6.48 1.37988 7.37C1.37988 8.26 4.34988 8.99 7.99988 8.99C11.6499 8.99 14.6199 8.26 14.6199 7.37C14.6199 6.48 11.6499 5.75 7.99988 5.75ZM7.99988 8.25C4.61988 8.25 1.87988 7.75 1.87988 7.13C1.87988 6.51 4.61988 6.01 7.99988 6.01C11.3799 6.01 14.1199 6.51 14.1199 7.13C14.1199 7.75 11.3799 8.25 7.99988 8.25Z"
        />
        <path d="M8 7.88C8.52 7.88 9.02 7.87 9.5 7.84V3.75H6.5V7.84C6.98 7.86 7.48 7.88 8 7.88Z" />
    </Svg>

);

export default Icon;
