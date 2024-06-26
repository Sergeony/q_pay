import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = ({ ...props }) => (
    <Svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M7.615 20.0005C7.155 20.0005 6.771 19.8465 6.463 19.5385C6.15433 19.2298 6 18.8455 6 18.3855V6.00047H5V5.00047H9V4.23047H15V5.00047H19V6.00047H18V18.3855C18 18.8455 17.846 19.2295 17.538 19.5375C17.2293 19.8461 16.845 20.0005 16.385 20.0005H7.615ZM9.808 17.0005H10.808V8.00047H9.808V17.0005ZM13.192 17.0005H14.192V8.00047H13.192V17.0005Z"
        />
    </Svg>
);

export default Icon;
