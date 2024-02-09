import React from 'react';
import styled from "styled-components";
import {AnonymousIcon, AwaitingIcon, SearchIcon, TetherIcon} from "../../UI/SVG";
import Logo from "../../components/common/Logo";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 482px;
    margin: 152px auto 0;


    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    font-size: 28px;
    font-family: 'Mulish', serif;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
`;


const PageTitle = styled.h2`
    margin-top: 16px;
    color: ${({theme}) => theme.form_title};
`;

const Description = styled.p`
    margin-top: 32px;
    
    font-size: 16px;
    color: #AFAAB6;
`;

const Advantages = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 88px;
`;

const AdvantageItem = styled.div`
`;

const AdvantageDescription = styled.p`
    font-family: 'Mulish', serif;
    font-weight: 400;
    font-size: 12px;
    color: ${({theme}) => theme.form_title};
`;

const IconsWrapper = styled.div`
    position: relative;
    stroke: #9E68F7;
`;

const TetherIconWrapper = styled.div`
    position: absolute;
    left: 57px;
    top: 13px;
    fill: #9E68F7;
    stroke: none;
`;

const LogoWrapper = styled.div`
    transform: scale(0.5);
`;

const BuyStep2 = () => {

  return (
    <ContentWrapper>
      <AwaitingIcon/>
      <PageTitle>Ожидание реквизитов для оплаты</PageTitle>
      <Description>Это не займет более 10 минут, не покидайте страницу</Description>
      <Advantages>
        <AdvantageItem>
          <AnonymousIcon/>
          <AdvantageDescription>100% анонимность оплаты товаров и услуг у наших партеров</AdvantageDescription>
        </AdvantageItem>

        <AdvantageItem>
          <IconsWrapper>
            <SearchIcon size={64} strokeWidth={0.5}/>
            <TetherIconWrapper>
              <TetherIcon  size={24}/>
            </TetherIconWrapper>
          </IconsWrapper>
          <AdvantageDescription>Быстрый поиск Tether под вашу покупку</AdvantageDescription>
        </AdvantageItem>

        <AdvantageItem>
          <LogoWrapper>
            <Logo/>
          </LogoWrapper>
          <AdvantageDescription>Вы платите сервису гривны, сервис платит Tether магазину</AdvantageDescription>
        </AdvantageItem>
      </Advantages>
    </ContentWrapper>
  );
};

export default BuyStep2;
