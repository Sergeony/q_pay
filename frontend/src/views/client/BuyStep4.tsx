import React from 'react';
import styled from "styled-components";
import {
  LoginFieldWrapper,
  StyledContainer,
  StyledCopyIcon,
  StyledField,
  StyledLabel,
} from "../../UI/CommonUI";
import {BankIcons} from "../../UI/SVG";


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

const MerchantTitle = styled.h2`
    color: #9E68F7;

    font-size: 28px;
    font-weight: 700;

    text-decoration: underline;
`;

const Warning = styled.p`
    color: #F93D3D;
    font-size: 12px;
    margin-top: 16px;
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

const DealTitle = styled.h2`
    font-family: Helvetica, serif;
    font-size: 18px;
    font-weight: 400;
    color: #0F0021;
`;

const Timer = styled.span`
    padding: 3px 7px;
    border-radius: 8px;
    border: 1px solid #46404B;

    color: #46404B;
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`;

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;


const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.theme_accent};
`;

const ButtonsWrapper = styled.div`
    display: flex;
    gap: 16px;
    margin-top: 32px;
    align-items: center;
    justify-content: center;
`;

const CancelButton = styled.button`
    border: 1px solid #F93D3D;
    border-radius: 16px;
    padding: 11px 7px;
    background: none;
    color: #F93D3D;

    font-size: 16px;
    font-family: 'Mulish', serif;
    font-weight: 700;
`;


const BuyStep4 = () => {
  const copyCode = async () => {
    await navigator.clipboard.writeText("@Qpay_crypto_support");
  };

  const Bank = BankIcons[2];

  return (
    <ContentWrapper>
      <TitleWrapper>
        <MerchantTitle>namemerch.com</MerchantTitle>
        <Timer>14:59</Timer>
      </TitleWrapper>

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

      <Description>Продавец оповещен, ожидайте подтверждения</Description>

      <Warning>*Если продавец по какой-то причине не отпускает монеты, то следует открыть спор</Warning>


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

      <ButtonsWrapper>
        <CancelButton style={{width: '154px'}}>Отменить сделку</CancelButton>
        <Timer>14:59</Timer>
      </ButtonsWrapper>
    </ContentWrapper>
  );
};

export default BuyStep4;
