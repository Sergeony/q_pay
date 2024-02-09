import React from 'react';
import styled from "styled-components";
import {FailedIcon} from "../../UI/SVG";
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


const PageTitle = styled.h2`
    margin-top: 16px;
    color: ${({theme}) => theme.form_title};
`;

const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.theme_accent};
`;

const StatusWrapper = styled.div`
    display: flex;
    justify-content: center;
`;


const BuyStep7 = () => {
  const copyCode = async () => {
    await navigator.clipboard.writeText("@Qpay_crypto_support");
  };

  return (
    <ContentWrapper>
      <StatusWrapper>
        <FailedIcon/>
      </StatusWrapper>

      <PageTitle>Ошибка при обработке сделки</PageTitle>
      <Description>В данный момент не найдены доступные реквизиты</Description>

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
    </ContentWrapper>
  );
};

export default BuyStep7;
