import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M12.6666 6L7.99992 10L3.33325 6"
            strokeWidth="1.0"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export default Icon;
