import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => (
    <Svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M4 1.6C7.528 1.6 10.4 4.472 10.4 8C10.4 11.528 7.528 14.4 4 14.4C3.728 14.4 3.456 14.384 3.192 14.344C4.72 12.616 5.6 10.36 5.6 8C5.6 5.64 4.72 3.384 3.192 1.656C3.456 1.616 3.728 1.6 4 1.6ZM4 0C2.544 0 1.176 0.4 0 1.08C2.392 2.464 4 5.04 4 8C4 10.96 2.392 13.536 0 14.92C1.176 15.6 2.544 16 4 16C8.416 16 12 12.416 12 8C12 3.584 8.416 0 4 0Z"
        />
    </Svg>

);

export default Icon;
