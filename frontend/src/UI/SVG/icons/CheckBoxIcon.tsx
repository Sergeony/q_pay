import React, {FunctionComponent} from "react";
import Svg, {SvgProps} from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_238_7267)">
        <path fillRule="evenodd" clipRule="evenodd"
              d="M5 3C4.46957 3 3.96086 3.21071 3.58579 3.58579C3.21071 3.96086 3 4.46957 3 5V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V5C21 4.46957 20.7893 3.96086 20.4142 3.58579C20.0391 3.21071 19.5304 3 19 3H5ZM5 5H19V19H5V5ZM16.95 9.795C17.0455 9.70275 17.1217 9.59241 17.1741 9.4704C17.2265 9.3484 17.2541 9.21718 17.2553 9.0844C17.2564 8.95162 17.2311 8.81994 17.1808 8.69705C17.1305 8.57415 17.0563 8.4625 16.9624 8.3686C16.8685 8.27471 16.7568 8.20046 16.634 8.15018C16.5111 8.0999 16.3794 8.0746 16.2466 8.07575C16.1138 8.0769 15.9826 8.10449 15.8606 8.1569C15.7386 8.20931 15.6282 8.28549 15.536 8.381L10.586 13.331L8.465 11.21C8.37216 11.1171 8.26192 11.0434 8.14059 10.9931C8.01926 10.9428 7.8892 10.9168 7.75785 10.9168C7.49258 10.9167 7.23814 11.022 7.0505 11.2095C6.86286 11.397 6.75739 11.6514 6.7573 11.9166C6.7572 12.1819 6.86249 12.4364 7.05 12.624L9.808 15.382C9.91015 15.4842 10.0314 15.5653 10.1649 15.6206C10.2984 15.6759 10.4415 15.7044 10.586 15.7044C10.7305 15.7044 10.8736 15.6759 11.0071 15.6206C11.1406 15.5653 11.2618 15.4842 11.364 15.382L16.95 9.795Z"
        />
      </g>
      <defs>
        <clipPath id="clip0_238_7267">
          <rect width="24" height="24"/>
        </clipPath>
      </defs>
    </Svg>


  );
};

export default Icon;
