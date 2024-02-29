import React, { FunctionComponent, SVGAttributes } from "react";
import PropTypes from "prop-types";

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement> {
    size?: number;
    useGradient?: boolean
}

const defaultProps: SvgProps = {
    xmlns: "http://www.w3.org/2000/svg",
};

const Svg: FunctionComponent<SvgProps> = React.memo((props) => (
    <svg
        width={props.size || props.width}
        height={props.size || props.height}
        xmlns={props.xmlns}
        viewBox={props.viewBox}
        fill={props.fill}
        className={props.className}
        strokeWidth={props.strokeWidth}
    >
        {props.children}
    </svg>
));

Svg.defaultProps = defaultProps;
Svg.displayName = "Svg";
Svg.propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    size: PropTypes.number,
    xmlns: PropTypes.string,
    strokeWidth: PropTypes.string,
    viewBox: PropTypes.string,
    fill: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default Svg;
