import React from 'react';
import styled from "styled-components";
import { FailedIcon} from "../../UI/SVG";
import { LoginFieldWrapper, StyledContainer, StyledCopyIcon, StyledField, StyledLabel } from "../../UI/CommonUI";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import TransactionInfo from "../../components/client/TransactionInfo";
import { copyCodeToClipBoard } from "../../utils";


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

const BuyStep6 = () => {
  const transaction = useSelector((state: RootState) => state.clientTransaction.transaction);
  const ourSupportLink = "@Qpay_crypto_support";

  return !transaction ? (
    <div>Loading...</div> // TODO: possibly, add some loader
  ) : (
    <ContentWrapper>
      <StatusWrapper>
        <FailedIcon/>
      </StatusWrapper>
      <PageTitle>Ошибка при оплате</PageTitle>
      <Description>Свяжитесь со Службой Поддержки для получения подробной информации</Description>
      <LoginFieldWrapper>
        <StyledLabel>Служба поддержки</StyledLabel>
        <StyledContainer id="codeField" onClick={() => copyCodeToClipBoard(ourSupportLink)}>
          <StyledCopyIcon/>
          <DefaultField type="text"
                        value={ourSupportLink}
                        readOnly
          />
        </StyledContainer>
      </LoginFieldWrapper>
      <TransactionInfo transaction={transaction} />
    </ContentWrapper>
  );
};

export default BuyStep6;
