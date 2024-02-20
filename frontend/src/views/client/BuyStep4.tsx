import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {
  LoginFieldWrapper,
  StyledContainer,
  StyledCopyIcon,
  StyledField,
  StyledLabel,
} from "../../UI/CommonUI";
import { useNavigate } from "react-router-dom";
import TransactionInfo from "../../components/client/TransactionInfo";
import {TransactionStatus} from "../../service/transactionsService";
import { copyCodeToClipBoard, formatTimerString } from "../../utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import useCountdown from "../../hooks/useCountdown";


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

// const Warning = styled.p`
//   color: #F93D3D;
//   font-size: 12px;
//   margin-top: 16px;
// `;

const Description = styled.p`
  font-size: 16px;
  font-family: 'Mulish', serif;
  font-weight: 700;
  color: #0F0021;
  margin-top: 64px;
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

// const ButtonsWrapper = styled.div`
//   display: flex;
//   gap: 16px;
//   margin-top: 32px;
//   align-items: center;
//   justify-content: center;
// `;
//
// const CancelButton = styled.button`
//   border: 1px solid #F93D3D;
//   border-radius: 16px;
//   padding: 11px 7px;
//   background: none;
//   color: #F93D3D;
//   font-size: 16px;
//   font-family: 'Mulish', serif;
//   font-weight: 700;
// `;


// interface BuyStep4Props {
//   remainingTime: string;
//   transaction: ClientTransactionProps;
// }

const BuyStep4 = () => {
  const transaction = useSelector((state: RootState) => state.clientTransaction.transaction);
  const navigate = useNavigate();
  const merchName = 'merchant.com';  // TODO: possibly, move to integration model get out there
  const ourSupportLink = "@Qpay_crypto_support";

  useEffect(() => {
    if (transaction !== null && [TransactionStatus.COMPLETED, TransactionStatus.PARTIAL, TransactionStatus.REFUND_REQUESTED].includes(transaction?.status))
      navigate("/client/buy/5/");
    else if (transaction !== null && transaction?.status == TransactionStatus.FAILED)
      navigate("client/buy/6");
  }, [transaction]);

  const handleExpire = () => {
    alert('Таймер истек!');
  };

  return !transaction ? (
    <div>Loading...</div> // TODO: possibly, add some loader
  ) : (
    <ContentWrapper>
      <TitleWrapper>
        <MerchantTitle>{merchName}</MerchantTitle>
        <Timer>{useCountdown(transaction.created_at, transaction.lifetime, handleExpire)}</Timer>
      </TitleWrapper>
      <TransactionInfo transaction={transaction} />
      <Description>Продавец оповещен, ожидайте подтверждения</Description>
      {/*<Warning>*Если продавец по какой-то причине не отпускает монеты, то следует открыть спор</Warning>*/}
      <LoginFieldWrapper>
        <StyledLabel>Служба поддержки</StyledLabel>
        <StyledContainer id="codeField" onClick={() => copyCodeToClipBoard(ourSupportLink)}>
          <StyledCopyIcon/>
          <DefaultField type="text"
                        value={ourSupportLink}
                        readOnly/>
        </StyledContainer>
      </LoginFieldWrapper>
    </ContentWrapper>
  );
};

export default BuyStep4;
