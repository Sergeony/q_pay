import React, {FunctionComponent} from "react";
import Svg, {SvgProps} from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd"
            d="M8.00019 0.833252C8.1328 0.833252 8.25998 0.88593 8.35374 0.979699C8.44751 1.07347 8.50019 1.20064 8.50019 1.33325V2.79325L9.64686 1.64659C9.74164 1.55827 9.86701 1.51018 9.99654 1.51247C10.1261 1.51475 10.2497 1.56723 10.3413 1.65884C10.4329 1.75045 10.4854 1.87404 10.4876 2.00357C10.4899 2.1331 10.4418 2.25847 10.3535 2.35325L8.50019 4.20658V7.13392L11.0349 5.67058L11.7135 3.13859C11.7305 3.07516 11.7598 3.01569 11.7998 2.96359C11.8397 2.91149 11.8896 2.86777 11.9464 2.83493C12.0033 2.80209 12.0661 2.78077 12.1312 2.77219C12.1963 2.76361 12.2624 2.76793 12.3259 2.78492C12.3893 2.8019 12.4487 2.83121 12.5008 2.87118C12.5529 2.91114 12.5967 2.96098 12.6295 3.01784C12.6624 3.0747 12.6837 3.13747 12.6923 3.20257C12.7008 3.26767 12.6965 3.33382 12.6795 3.39725L12.2595 4.96392L13.5235 4.23392C13.6383 4.16866 13.7742 4.15145 13.9017 4.18604C14.0291 4.22064 14.1376 4.30423 14.2037 4.41857C14.2697 4.53291 14.2878 4.66873 14.254 4.79638C14.2203 4.92403 14.1374 5.03314 14.0235 5.09992L12.7602 5.82925L14.3269 6.24925C14.455 6.28364 14.5641 6.36751 14.6304 6.48241C14.6967 6.5973 14.7146 6.73382 14.6802 6.86192C14.6458 6.99002 14.5619 7.09921 14.447 7.16547C14.3321 7.23174 14.1956 7.24964 14.0675 7.21525L11.5355 6.53659L9.00019 7.99992L11.5349 9.46325L14.0669 8.78458C14.195 8.75028 14.3316 8.76831 14.4465 8.8347C14.5614 8.90108 14.6452 9.0104 14.6795 9.13859C14.7138 9.26677 14.6958 9.40334 14.6294 9.51823C14.563 9.63313 14.4537 9.71695 14.3255 9.75125L12.7595 10.1706L14.0235 10.9006C14.0808 10.9332 14.1312 10.9768 14.1716 11.0289C14.212 11.081 14.2417 11.1406 14.2589 11.2042C14.2762 11.2679 14.2807 11.3343 14.2722 11.3997C14.2637 11.4651 14.2424 11.5281 14.2094 11.5852C14.1764 11.6424 14.1325 11.6924 14.0801 11.7324C14.0277 11.7725 13.9679 11.8018 13.9042 11.8186C13.8404 11.8355 13.774 11.8396 13.7087 11.8306C13.6433 11.8217 13.5804 11.7999 13.5235 11.7666L12.2595 11.0366L12.6795 12.6026C12.6965 12.666 12.7008 12.7322 12.6923 12.7973C12.6837 12.8624 12.6624 12.9251 12.6295 12.982C12.5967 13.0389 12.5529 13.0887 12.5008 13.1287C12.4487 13.1686 12.3893 13.1979 12.3259 13.2149C12.2624 13.2319 12.1963 13.2362 12.1312 13.2276C12.0661 13.2191 12.0033 13.1977 11.9464 13.1649C11.8896 13.1321 11.8397 13.0883 11.7998 13.0362C11.7598 12.9841 11.7305 12.9247 11.7135 12.8613L11.0349 10.3293L8.50019 8.86658V11.7933L10.3535 13.6466C10.4013 13.6927 10.4394 13.7478 10.4657 13.8088C10.4919 13.8698 10.5057 13.9354 10.5063 14.0018C10.5069 14.0682 10.4943 14.134 10.4692 14.1955C10.4441 14.257 10.407 14.3128 10.3601 14.3598C10.3131 14.4067 10.2573 14.4439 10.1959 14.4691C10.1345 14.4942 10.0686 14.5069 10.0022 14.5064C9.93584 14.5058 9.87022 14.4921 9.80921 14.4659C9.74819 14.4397 9.693 14.4017 9.64686 14.3539L8.50019 13.2073V14.6666C8.50019 14.7992 8.44751 14.9264 8.35374 15.0201C8.25998 15.1139 8.1328 15.1666 8.00019 15.1666C7.86758 15.1666 7.74041 15.1139 7.64664 15.0201C7.55287 14.9264 7.50019 14.7992 7.50019 14.6666V13.2066L6.35352 14.3533C6.25874 14.4416 6.13338 14.4897 6.00384 14.4874C5.87431 14.4851 5.75072 14.4326 5.65911 14.341C5.5675 14.2494 5.51503 14.1258 5.51274 13.9963C5.51045 13.8667 5.55854 13.7414 5.64686 13.6466L7.50019 11.7933V8.86592L4.96552 10.3293L4.28686 12.8613C4.26987 12.9247 4.24056 12.9841 4.2006 13.0362C4.16063 13.0883 4.1108 13.1321 4.05394 13.1649C3.99708 13.1977 3.9343 13.2191 3.8692 13.2276C3.80411 13.2362 3.73795 13.2319 3.67452 13.2149C3.6111 13.1979 3.55163 13.1686 3.49953 13.1287C3.44743 13.0887 3.40371 13.0389 3.37087 12.982C3.33803 12.9251 3.31671 12.8624 3.30813 12.7973C3.29955 12.7322 3.30387 12.666 3.32086 12.6026L3.74086 11.0359L2.47686 11.7666C2.36193 11.8329 2.22537 11.8508 2.09722 11.8164C1.96907 11.7821 1.85983 11.6982 1.79352 11.5833C1.72722 11.4683 1.70929 11.3318 1.74367 11.2036C1.77805 11.0755 1.86193 10.9662 1.97686 10.8999L3.24086 10.1706L1.67419 9.75058C1.60909 9.73515 1.54775 9.7068 1.4938 9.66722C1.43985 9.62765 1.39439 9.57765 1.36012 9.52018C1.32585 9.46272 1.30346 9.39896 1.29428 9.33269C1.2851 9.26641 1.28931 9.19897 1.30667 9.13435C1.32403 9.06973 1.35418 9.00926 1.39534 8.95651C1.4365 8.90376 1.48782 8.8598 1.54628 8.82725C1.60473 8.79469 1.66913 8.7742 1.73564 8.76699C1.80216 8.75978 1.86945 8.76599 1.93352 8.78525L4.46552 9.46325L7.00019 7.99992L4.46552 6.53659L1.93352 7.21525C1.87005 7.23224 1.80386 7.23655 1.73872 7.22795C1.67357 7.21936 1.61077 7.19801 1.55387 7.16514C1.49698 7.13227 1.44712 7.08851 1.40714 7.03637C1.36716 6.98423 1.33784 6.92472 1.32086 6.86125C1.30387 6.79778 1.29956 6.73158 1.30816 6.66644C1.31675 6.6013 1.3381 6.53849 1.37097 6.4816C1.40384 6.42471 1.4476 6.37485 1.49974 6.33487C1.55188 6.29489 1.61139 6.26557 1.67486 6.24859L3.24086 5.82925L1.97686 5.09992C1.91995 5.06709 1.87007 5.02337 1.83006 4.97126C1.79005 4.91915 1.76069 4.85967 1.74367 4.79622C1.72664 4.73277 1.72228 4.66658 1.73084 4.60144C1.73939 4.53631 1.76069 4.47349 1.79352 4.41658C1.82635 4.35968 1.87007 4.3098 1.92218 4.26979C1.97429 4.22977 2.03377 4.20042 2.09722 4.1834C2.22537 4.14901 2.36193 4.16695 2.47686 4.23325L3.74019 4.96392L3.32019 3.39792C3.28589 3.26973 3.30392 3.13317 3.3703 3.01827C3.43669 2.90337 3.546 2.81955 3.67419 2.78525C3.80238 2.75095 3.93894 2.76898 4.05384 2.83536C4.16874 2.90175 4.25256 3.01106 4.28686 3.13925L4.96486 5.67125L7.50019 7.13325V4.20658L5.64686 2.35325C5.55854 2.25847 5.51045 2.1331 5.51274 2.00357C5.51503 1.87404 5.5675 1.75045 5.65911 1.65884C5.75072 1.56723 5.87431 1.51475 6.00384 1.51247C6.13338 1.51018 6.25874 1.55827 6.35352 1.64659L7.50019 2.79325V1.33325C7.50019 1.20064 7.55287 1.07347 7.64664 0.979699C7.74041 0.88593 7.86758 0.833252 8.00019 0.833252Z"
            />
    </Svg>


  );
};

export default Icon;
