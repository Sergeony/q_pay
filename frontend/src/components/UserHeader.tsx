import React from 'react';
import styled from 'styled-components';
import {MoonIcon, SunIcon, ChevronIcon, NotificationBellIcon, SnowFlakeIcon, TetherIcon} from "../UI/SVG";
import {useAppDispatch} from "../hooks/useAppDispatch";
import {toggleTheme} from "../reducers/setThemeReducer";
import {useDispatch} from "react-redux";
import {Dispatch} from "redux";
import {AppThunk} from "../store/store";
import {Action} from "@reduxjs/toolkit";


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
    font-family: 'AKONY', serif;
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

const LangChevronIconWrapper = styled.div`
    display: flex;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
`;

const StyledNav = styled.nav`
    display: flex;
    gap: 20px;
    margin-left: 50px;
`;

const NavLink = styled.a`
    text-decoration: none;
    color: black;
    padding: 8px;
    width: 132px;

    font-family: "Mulish", serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;

    color: ${({theme}) => theme.header_nav_link_text_color};

`;

const BalancesWrapper = styled.div`
    padding: 8px;
    width: 132px;
    border: 1px solid;
    border-color: ${({theme}) => theme.balance_wrapper_border_color};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    margin-right: 20px;
`;

const BalancesContainer = styled.div`
    text-align: right;
`;

const ActiveBalance = styled.span`
    display: block;
    color:  ${({theme}) => theme.active_balance_text_color};
`;

const FrozenBalance = styled.span`
    display: block;
    background:  ${({theme}) => theme.frozen_balance_text_color};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const NotificationBell = styled(NotificationBellIcon)`
    fill: ${({theme}) => theme.notification_bell_fill_color};
`;

const StyledTetherIcon = styled(TetherIcon)`
    fill: ${({theme}) => theme.notification_bell_fill_color};
`;

const StyledSnowFlakeIcon = styled(TetherIcon)`
    fill: ${({theme}) => theme.notification_bell_fill_color};
`;

const UserHeader = () => {
  const dispatch = useAppDispatch();


  return (
    <HeaderContainer>
      <LogoWrapper>
        <LogoQ>Q</LogoQ>
        <LogoPayAndUserTypeWrapper>
          <LogoPay>pay</LogoPay>
          <LogoUserType>CLIENT</LogoUserType>
        </LogoPayAndUserTypeWrapper>
      </LogoWrapper>

      <ThemeToggleWrapper onClick={() => dispatch(toggleTheme())}>
        <ToggleCircle>
          <MoonIcon/>
        </ToggleCircle>
        <ToggleCircle>
          <SunIcon/>
        </ToggleCircle>
      </ThemeToggleWrapper>

      <StyledNav>
        <NavLink href="#">Объявления</NavLink>
        <NavLink href="#">Продажа</NavLink>
        <NavLink href="#">Покупка</NavLink>
        <NavLink href="#" style={{width: "284px"}}>Логи уведомлений по АЗ</NavLink>
        <NavLink href="#">Настройки</NavLink>
      </StyledNav>

      <BalancesWrapper>
        <BalancesContainer>
          <ActiveBalance>1 256 312 <TetherIcon/></ActiveBalance>
          <FrozenBalance>5 438 <SnowFlakeIcon/></FrozenBalance>
        </BalancesContainer>
      </BalancesWrapper>

      <NotificationBell/>

      <LangWrapper>
        <LangSelect>
          <option value="en">English</option>
          <option value="ru">Русский</option>
        </LangSelect>
        <LangChevronIconWrapper>
          <ChevronIcon/>
        </LangChevronIconWrapper>
      </LangWrapper>
    </HeaderContainer>
  );
};

export default UserHeader;
