import React from 'react';
import styled from "styled-components";
import {BankIcons, FailedIcon} from "../../UI/SVG";
import {LoginFieldWrapper, StyledContainer, StyledCopyIcon, StyledField, StyledLabel} from "../../UI/CommonUI";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 436px;
    margin: 152px auto 0;


    display: flex;
    flex-direction: column;
    text-align: center;
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

const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.theme_accent};
`;


const StatusWrapper = styled.div`
    display: flex;
    justify-content: center;
`;


const BuyStep6 = () => {
  const Bank = BankIcons[2];
  const copyCode = async () => {
    await navigator.clipboard.writeText("@Qpay_crypto_support");
  };

  return (
    <ContentWrapper>
      <StatusWrapper>
        <FailedIcon/>
      </StatusWrapper>

      <PageTitle>Ошибка при оплате</PageTitle>
      <Description>Свяжитесь со Службой Поддержки для получения подробной информации</Description>

      <LoginFieldWrapper>
        <StyledLabel>Служба поддержки</StyledLabel>
        <StyledContainer id="codeField" onClick={copyCode}>
          <StyledCopyIcon/>
          <DefaultField type="text"
                        value={"@Qpay_crypto_support"}
                        readOnly
          />
        </StyledContainer>
      </LoginFieldWrapper>

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

export default BuyStep6;
