import React from 'react';
import styled from 'styled-components';
import {MoonIcon, SunIcon, ChevronIcon} from "../../UI/SVG";
import DropDown from "./DropDown";


const HeaderContainer = styled.header`
    height: 100px;
    align-items: center;
    //padding: 0 40px;
    display: flex;
    background-color: ${({theme}) => theme.header_background_color};
    border-bottom: ${({theme}) => theme.header_border};
`;

const LogoWrapper = styled.div`
    margin-left: 210px;
    display: flex;
    font-family: 'Akony', serif;
    align-items: center;
`;

const LogoQ = styled.div`
    font-size: 59px;
    font-weight: 700;
    line-height: 65px;
    letter-spacing: 0;
    text-align: left;
    color: ${({theme}) => theme.logo_q};
`;

const LogoPayAndUserTypeWrapper = styled.div`
`;

const LogoPay = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 18px;
    letter-spacing: 0;
    text-align: center;
    color: #474A40;
`;

const LogoUserType = styled.div`
    font-family: 'COMMIT-MONO', serif;
    font-size: 12px;
    font-style: italic;
    font-weight: 700;
    line-height: 13px;
    letter-spacing: 0;
    text-align: center;
    color: #AFB4A8;
`;


const ThemeToggleWrapper = styled.div`
    background-color: black;
    border-radius: 15px;
    margin-left: 35px;
    display: flex;
`;

const ToggleCircle = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: black;
    justify-content: center;
    align-items: center;
    display: flex;
`;


const LangWrapper = styled.div`
    position: relative;
    margin-right: 228px;
    margin-inline-start: auto;
`;

const LangSelect = styled.select`
    width: 96px;
    height: 34px;
    background-color: transparent;
    border-radius: 8px;
    border: 2px solid;
    border-color: ${({theme}) => theme.lang_select_color};
    color: ${({theme}) => theme.lang_select_color};;
    padding: 6px 14px;
    appearance: none;
    font-family: Mulish, sans-serif;
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
`;

const StyledChevronIcon = styled(ChevronIcon)`
    stroke: ${({theme}) => theme.lang_select_color};
`;

const LangChevronIconWrapper = styled.div`
    display: flex;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
`;

interface IProps {
  children?: React.ReactNode;
}

const defaultProps: IProps = {
  children: null
};

const Header = ({ children }: IProps) => {


  return (
    <HeaderContainer>
      <LogoWrapper>
        <LogoQ>Q</LogoQ>
        <LogoPayAndUserTypeWrapper>
          <LogoPay>pay</LogoPay>
          <LogoUserType>CLIENT</LogoUserType>
        </LogoPayAndUserTypeWrapper>
      </LogoWrapper>

      {/*TODO: implement toggle*/}
      <ThemeToggleWrapper onClick={() => ""}>
        <ToggleCircle>
          <MoonIcon/>
        </ToggleCircle>
        <ToggleCircle>
          <SunIcon/>
        </ToggleCircle>
      </ThemeToggleWrapper>

      {children}

      <DropDown width={'132px'}
                options={[
        {value: "en", label: "English"},
        {value: "ru", label: "Русский"},
      ]}/>
    </HeaderContainer>
  );
};

Header.defaultProps = defaultProps;


export default Header;
