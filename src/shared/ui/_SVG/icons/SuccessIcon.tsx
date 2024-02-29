import React, { FunctionComponent } from "react";
import Svg, { SvgProps } from "../Svg";

const Icon: FunctionComponent<SvgProps> = (props) => (
    <Svg width="206" height="206" viewBox="0 0 206 206" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M103 0.333496C116.482 0.333496 129.832 2.98905 142.289 8.14853C154.745 13.308 166.063 20.8704 175.596 30.4039C185.129 39.9374 192.692 51.2552 197.851 63.7113C203.011 76.1674 205.666 89.5178 205.666 103C205.666 116.483 203.011 129.833 197.851 142.289C192.692 154.745 185.129 166.063 175.596 175.596C166.063 185.13 154.745 192.692 142.289 197.852C129.832 203.011 116.482 205.667 103 205.667C75.7708 205.667 49.6571 194.85 30.4034 175.596C11.1496 156.343 0.333008 130.229 0.333008 103C0.333008 75.7713 11.1496 49.6576 30.4034 30.4039C49.6571 11.1501 75.7708 0.333496 103 0.333496ZM103 17.4446C80.3089 17.4446 58.5475 26.4585 42.5028 42.5033C26.458 58.548 17.4441 80.3094 17.4441 103C17.4441 125.691 26.458 147.452 42.5028 163.497C58.5475 179.542 80.3089 188.556 103 188.556C125.69 188.556 147.452 179.542 163.497 163.497C179.541 147.452 188.555 125.691 188.555 103C188.555 80.3094 179.541 58.548 163.497 42.5033C147.452 26.4585 125.69 17.4446 103 17.4446ZM90.1663 120.83L139.275 71.5842C140.781 70.0625 142.803 69.1609 144.942 69.0573C147.08 68.9537 149.18 69.6557 150.826 71.0246C152.472 72.3936 153.545 74.33 153.834 76.4515C154.122 78.5731 153.604 80.7256 152.382 82.4839L151.39 83.6817L96.2237 138.985C94.8102 140.405 92.9432 141.284 90.9482 141.468C88.9532 141.653 86.9567 141.131 85.3068 139.994L84.109 139.002L54.1646 109.058C52.6488 107.548 51.7532 105.526 51.6543 103.39C51.5554 101.253 52.2604 99.1572 53.6303 97.5146C55.0002 95.8721 56.9356 94.8022 59.0552 94.5158C61.1748 94.2294 63.3248 94.7473 65.0815 95.9675L66.2792 96.9428L90.1663 120.83Z"
            fill="url(#paint0_linear_1342_8848)"
        />
        <defs>
            <linearGradient
                id="paint0_linear_1342_8848"
                x1="0.333008"
                y1="0.333496"
                x2="205.666"
                y2="205.667"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#22EF10" />
                <stop offset="1" stopColor="#3EC0F8" />
            </linearGradient>
        </defs>
    </Svg>

);

export default Icon;
