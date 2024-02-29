import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M1.33366 18.6665C1.33366 19.3737 1.61461 20.052 2.11471 20.5521C2.61481 21.0522 3.29308 21.3332 4.00033 21.3332L12.427 21.3332L11.147 27.4265C11.1203 27.5598 11.107 27.7065 11.107 27.8532C11.107 28.3998 11.3337 28.9065 11.6937 29.2665L13.107 30.6665L21.8803 21.8932C22.3737 21.3998 22.667 20.7332 22.667 19.9998L22.667 6.6665C22.667 5.95926 22.386 5.28098 21.8859 4.78089C21.3858 4.28079 20.7076 3.99984 20.0003 3.99984L8.00033 3.99984C6.89366 3.99984 5.947 4.6665 5.547 5.6265L1.52033 15.0265C1.40033 15.3332 1.33366 15.6532 1.33366 15.9998L1.33366 18.6665ZM30.667 3.99984L25.3337 3.99984L25.3337 19.9998L30.667 19.9998L30.667 3.99984Z"
        />
    </Svg>
);

export default Icon;
