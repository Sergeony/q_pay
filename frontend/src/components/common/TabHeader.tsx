import React from 'react';
import styled from 'styled-components';
import Switch from "./Switch";


const HeaderContainer = styled.header`
    height: 50px;
    display: flex;
    align-items: center;

    background: linear-gradient(180deg, rgba(149, 147, 147, 0.15) 0%, rgba(149, 147, 147, 0.00) 128%);
    // border-bottom: ${({theme}) => theme.header_border};

    justify-content: space-evenly;
    
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


const TabHeader = () => {

  return (
    <HeaderContainer>
      {/*<RatesWrapper>*/}
        <RateWrapper style={{ margin: "0 0 0 300px" }}>
          <RateLabel>Мой курс</RateLabel>
          <RateValue>38.74 / 48.52</RateValue>
        </RateWrapper>
        <RateWrapper>
          <RateLabel>Курс биржи</RateLabel>
          <RateValue>38.74 / 48.52</RateValue>
        </RateWrapper>
      {/*</RatesWrapper>*/}
      {/*<Switch size={"large"} />*/}
    </HeaderContainer>
  );
};

export default TabHeader;
