import React from 'react';
import styled from "styled-_components";


const LogoWrapper = styled.div`
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


const Logo = () => {
  return (
    <LogoWrapper>
      <LogoQ>Q</LogoQ>
      <LogoPayAndUserTypeWrapper>
        <LogoPay>pay</LogoPay>
        <LogoUserType>CLIENT</LogoUserType>
      </LogoPayAndUserTypeWrapper>
    </LogoWrapper>
  );
};

export default Logo;
