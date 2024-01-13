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
    height: 50px;
    display: flex;
    align-items: center;

    background-color: ${({theme}) => theme.header_background_color};
    border-bottom: ${({theme}) => theme.header_border};

    justify-content: center;
    
`;

const RatesWrapper = styled.div`
    justify-content: center;
    display: flex;
    gap: 20px;
`;

const RateWrapper = styled.div`
    //margin: 0 25px;
    display: flex;
    gap: 16px;
`;

const RateLabel = styled.span`
    color: ${({theme}) => theme.rate_label_text_color};

    font-family: 'Mulish', serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;

`;

const RateValue = styled.span`
    //padding: 0 13px;
    color: ${({theme}) => theme.rate_text_color};

    font-family: 'Inter', serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
    letter-spacing: 0;
    text-align: left;

`;

const ToggleWrapper = styled.button`
    width: 53px;
    height: 30px;
    border-radius: 15px;
    background-color: ${({theme}) => theme.theme_accent};
    border: none;
    padding: 3.5px;

    margin: 0 25px;
`;

const ToggleSpan = styled.span`
    display: flex;
    width: 23px;
    height: 23px;
    border-radius: 50%;
    background-color: ${({theme}) => theme.toggle_span_background_color};
`;


const TabHeader = () => {
  const dispatch = useAppDispatch();


  return (
    <HeaderContainer>
      {/*<RatesWrapper>*/}
        <RateWrapper>
          <RateLabel>Мой курс</RateLabel>
          <RateValue>38.74 / 48.52</RateValue>
        </RateWrapper>
        <RateWrapper>
          <RateLabel>Курс биржи</RateLabel>
          <RateValue>38.74 / 48.52</RateValue>
        </RateWrapper>
      {/*</RatesWrapper>*/}
      <ToggleWrapper>
        <ToggleSpan/>
      </ToggleWrapper>
    </HeaderContainer>
  );
};

export default TabHeader;
