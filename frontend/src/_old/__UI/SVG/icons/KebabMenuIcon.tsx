import React, {FunctionComponent} from "react";
import Svg, {SvgProps} from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => {
  return (
    <Svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12 7.5C11.4696 7.5 10.9609 7.28929 10.5858 6.91421C10.2107 6.53914 10 6.03043 10 5.5C10 4.96957 10.2107 4.46086 10.5858 4.08579C10.9609 3.71071 11.4696 3.5 12 3.5C12.5304 3.5 13.0391 3.71071 13.4142 4.08579C13.7893 4.46086 14 4.96957 14 5.5C14 6.03043 13.7893 6.53914 13.4142 6.91421C13.0391 7.28929 12.5304 7.5 12 7.5ZM12 14.5C11.4696 14.5 10.9609 14.2893 10.5858 13.9142C10.2107 13.5391 10 13.0304 10 12.5C10 11.9696 10.2107 11.4609 10.5858 11.0858C10.9609 10.7107 11.4696 10.5 12 10.5C12.5304 10.5 13.0391 10.7107 13.4142 11.0858C13.7893 11.4609 14 11.9696 14 12.5C14 13.0304 13.7893 13.5391 13.4142 13.9142C13.0391 14.2893 12.5304 14.5 12 14.5ZM12 21.5C11.4696 21.5 10.9609 21.2893 10.5858 20.9142C10.2107 20.5391 10 20.0304 10 19.5C10 18.9696 10.2107 18.4609 10.5858 18.0858C10.9609 17.7107 11.4696 17.5 12 17.5C12.5304 17.5 13.0391 17.7107 13.4142 18.0858C13.7893 18.4609 14 18.9696 14 19.5C14 20.0304 13.7893 20.5391 13.4142 20.9142C13.0391 21.2893 12.5304 21.5 12 21.5Z"
        fill="#0F0021"/>
    </Svg>
  );
};

export default Icon;