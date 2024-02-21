import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {Button, LoginFieldWrapper, StyledContainer, StyledCopyIcon, StyledField, StyledLabel,} from "../../UI/CommonUI";
import {clientWebSocketService} from "../../service/clientWebSocketService";
import {TransactionStatus} from "../../service/transactionsService";

import {RootState} from "../../store/store";
import {copyCodeToClipBoard, formatTimerString} from "../../utils";
import TransactionInfo from "../../components/client/TransactionInfo";
import ConfirmTransactionModal from "./ConfirmTransactionModal";
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
  gap: 8px;
  margin-top: 32px;
  align-items: center;
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


const BuyStep3 = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const transaction = useSelector((state: RootState) => state.clientTransaction.transaction);
  const navigate = useNavigate();
  const apiKey = 'i00000000';           // TODO: possibly, move to URL
  const merchName = 'merchant.com';  // TODO: possibly, move to integration model get out there

  const handleClick = (status: TransactionStatus) => {
    if (transaction !== null) {
      clientWebSocketService.sendMessageChangeTransactionStatus(transaction.order_id, status);

      if (status == TransactionStatus.CANCELLED)
        navigate("/client/buy/6/");
      else if(status == TransactionStatus.REVIEWING)
        navigate("/client/buy/4");
    }
  };

  useEffect(() => {
    if (transaction) {
      clientWebSocketService.connect(apiKey);
    }
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
      <TransactionInfo transaction={transaction}/>
      <Description>
        Отправьте <Amount>{transaction?.amount * 38} UAH</Amount> по указаным продавцом реквизитам
      </Description>
      <LoginFieldWrapper>
        <StyledLabel>Реквизиты для перевода</StyledLabel>
        <StyledContainer id="codeField" onClick={() => copyCodeToClipBoard(transaction.card_number)}>
          <StyledCopyIcon/>
          <DefaultField type="text"
                        value={transaction?.card_number}
                        readOnly={true}/>
        </StyledContainer>
      </LoginFieldWrapper>
      <Warning>
        *Если Вы не подтвердите перевод в течении {transaction.lifetime} минут, то сделка будет отменена автоматически!
      </Warning>
      <ButtonsWrapper>
        <Button style={{width: '275px'}}
                onClick={() => setModalIsOpen(true)}>
          Подтвердить перевод
        </Button>
        <CancelButton onClick={() => handleClick(TransactionStatus.CANCELLED)}>
          Отменить сделку
        </CancelButton>
      </ButtonsWrapper>
      {modalIsOpen && <ConfirmTransactionModal onClose={() => setModalIsOpen(false)}
                                               onConfirm={() => handleClick(TransactionStatus.REVIEWING)}/>
      }
    </ContentWrapper>
  );
};

export default BuyStep3;
