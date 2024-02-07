import React from 'react';
import styled from "styled-components";
import {LoginFieldWrapper, StyledContainer, StyledCopyIcon, StyledField, StyledPasteIcon} from "../../UI/CommonUI";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 500px;
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

const MerchantTitle = styled.h2`
    color: #9E68F7;

    font-size: 28px;
    font-weight: 700;

    text-decoration: underline;
`;

const DescriptionDiv = styled.div`
    font-family: "Helvetica", serif;
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 0;
    text-align: center;

    color: ${({theme}) => theme.description_text_color};
    
    margin-top: 32px;
`;

const Warning = styled.p`
    color: #F93D3D;
    font-size: 12px;
    
    margin-top: 32px;
`;

const Amount = styled.span`
    color: #9E68F7;
`;

const Description = styled.p`
    font-size: 16px;
    font-family: 'Mulish', serif;
    font-weight: 700;
    color: #0F0021;
    
    margin-top: 64px;
`;

const Article = styled.article`
    margin-top: 24px;
    text-align: left;
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


`;

const DT = styled.dt`
    color: #46404B;
`;

const PageTitle = styled.h2`
    font-family: Helvetica, serif;
    font-size: 18px;
    font-weight: 400;
    color: #0F0021;
`;

const BuyStep3 = () => {
  const copyCode = async () => {
    await navigator.clipboard.writeText("2342342342342324223");
  };

  return (
    <ContentWrapper>
      <MerchantTitle>namemerch.com</MerchantTitle>
      <Article>
        <PageTitle>ИНФОРМАЦИЯ О СДЕЛКЕ:</PageTitle>
        <DL>
          <DItem>
            <DT>Вы отдаете:</DT>
            <DD>1345грн</DD>
          </DItem>

          <DItem>
            <DT>Вы получаете:</DT>
            <DD>13т</DD>
          </DItem>
          <DItem style={{marginTop: "8px"}}>
            <DT>Способ оплаты:</DT>
            <DD>ПриватБанк</DD>
          </DItem>

          <DItem>
            <DT>QPay ID Сделки:</DT>
            <DD>sdf-sdfsfsfd-sfsfsdf-sfsdfsdfsfds-sdffsdfs</DD>
          </DItem>
        </DL>
      </Article>

      <Description>Отправьте <Amount>1345 UAH</Amount> по указаным продавцом реквизитам</Description>

      <DescriptionDiv>
        Реквизиты для перевода
      </DescriptionDiv>
      <LoginFieldWrapper>
        <StyledContainer id="codeField" onClick={copyCode}>
          <StyledCopyIcon/>
          <StyledField value={"2342342342342324223"} readOnly/>
        </StyledContainer>
      </LoginFieldWrapper>

      <Warning>*Есл Вы не подтвердите перевод в течении 15 минут, то сделка будет отменена автоматически!</Warning>

    </ContentWrapper>
  );
};

export default BuyStep3;
