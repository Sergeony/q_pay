import React, { FunctionComponent, SVGAttributes } from "react";
import PropTypes from "prop-types";


export type SvgProps = SVGAttributes<HTMLOrSVGElement>

type OwnProps = SvgProps

type Props = OwnProps;

const defaultProps: Props = {
  height: "31px",
  xmlns: "http://www.w3.org/2000/svg",
};

const Svg: FunctionComponent<Props> = React.memo((props) => {
  return (
    <svg
      width={props.width}
      height={props.height}
      xmlns={props.xmlns}
      viewBox={props.viewBox}
      fill={props.fill}
      className={props.className}
      strokeWidth={props.strokeWidth}
    >
      {props.children}
    </svg>
  );
});

Svg.defaultProps = defaultProps;
Svg.displayName = 'Svg';
Svg.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  xmlns: PropTypes.string,
  strokeWidth: PropTypes.string,
  viewBox: PropTypes.string,
  fill: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
}

export default Svg;
