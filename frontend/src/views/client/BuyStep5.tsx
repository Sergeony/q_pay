import React from 'react';
import styled from "styled-components";
import {BankIcons, SuccessIcon, ThumbIcon} from "../../UI/SVG";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 436px;
    margin: 152px auto 0;


    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    font-size: 28px;
    font-family: 'Mulish', serif;
    font-weight: 700;
    font-style: normal;
    line-height: normal;
`;

const Description = styled.p`
    font-size: 16px;
    font-family: 'Mulish', serif;
    font-weight: 700;
    color: #AFAAB6;
    
    margin-top: 16px;
`;

const Article = styled.article`
    margin-top: 64px;
    text-align: left;
    width: 100%;    
`;


const DL = styled.dl`
    font-size: 16px;
    font-family: 'Mulish', serif;
    font-weight: 400;
    
    margin-top: 16px;
    
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const DItem = styled.div`
    display: flex;
    gap: 16px;
`;

const DD = styled.dd`
    color: #0F0021;
    display: flex;
    align-items: center;
    gap: 8px;
`;

const DT = styled.dt`
    color: #46404B;
    display: flex;
    align-items: center;
`;

const PageTitle = styled.h2`
    margin-top: 16px;
    color: ${({theme}) => theme.form_title};
`;

const DealTitle = styled.h2`
    font-family: Helvetica, serif;
    font-size: 18px;
    font-weight: 400;
    color: #0F0021;
`;


const ButtonsWrapper = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 16px;
    align-items: center;
    justify-content: center;
    width: 100%;
`;



const RateDeal = styled.p`
    color: #46404B;
    font-size: 18px;
    font-family: 'Helvetica', serif;
    font-weight: 400;
    margin-top: 32px;
`;

const ThumbButton = styled.button`
    width: 100%;
    cursor: pointer;
    border: 2px solid;
    border-radius: 8px;
    padding: 6px 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(180deg, rgba(120, 124, 113, 0.45) -148.5%, rgba(255, 255, 255, 0.45) 8.66%, rgba(116, 125, 97, 0.36) 248.5%);
`;

const ThumbUpButton = styled(ThumbButton)`
    border-color: ${({ theme }) => theme.theme_accent};
    > svg {
      fill: ${({ theme }) => theme.theme_accent};
    }
`;

const ThumbDownButton = styled(ThumbButton)`
    border-color: #F93D3D;
    > svg {
      fill: #F93D3D;
      rotate: 180deg;
    }
`;


const BuyStep5 = () => {
  const Bank = BankIcons[2];

  return (
    <ContentWrapper>

      <SuccessIcon/>

      <PageTitle>Оплата прошла успешно</PageTitle>
      <Description>Перевод совершен на баланс магазина</Description>

      <RateDeal>Оцените качество сделки</RateDeal>

      <ButtonsWrapper>
        <ThumbUpButton>
          <ThumbIcon/>
        </ThumbUpButton>
        <ThumbDownButton>
          <ThumbIcon/>
        </ThumbDownButton>
      </ButtonsWrapper>

      <Article>
        <DealTitle>ИНФОРМАЦИЯ О СДЕЛКЕ:</DealTitle>
        <DL>
          <DItem>
            <DT>Вы отдаете:</DT>
            <DD>1345грн</DD>
          </DItem>

          <DItem>
            <DT>Вы получаете:</DT>
            <DD>13т</DD>
          </DItem>
          <DItem>
            <DT>Способ оплаты:</DT>
            <DD><Bank size={24}/>ПриватБанк</DD>
          </DItem>

          <DItem>
            <DT>ID Сделки:</DT>
            <DD>sdf-sdfsfsfd-sfsfsdf-sfsdfsdfsfds-sdffsdfs</DD>
          </DItem>
        </DL>
      </Article>
    </ContentWrapper>
  );
};

export default BuyStep5;
