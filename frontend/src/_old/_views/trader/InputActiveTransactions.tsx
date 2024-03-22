import {AutomationIcon, BankIcons, TetherIcon} from "../../__UI/SVG";
import React, {useEffect, useState} from "react";
import styled from "styled-_components";
import {Button} from "../../__UI/CommonUI";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../src/_store/store";
import {formatDate, formatTime} from "../../utils";
import {webSocketService} from "../../../src/_service/webSocketService";
import {TransactionProps, TransactionStatus, TransactionType} from "../../../src/_service/transactionsService";
import {updateTransaction} from "../../../src/_store/reducers/webSocketSlice";


const StyledTable = styled.table`
    border-collapse: separate;
    margin-top: 32px;
    width: 100%;
`;

const StyledTd = styled.td`
    display: flex;
    justify-content: center;
    align-items: center;

`;

const Bank = styled(StyledTd)`
    gap: 16px;
    width: 129px;
    justify-content: start;
`;

const TranIDTitle = styled.span`
    width: 100%;
    text-align: start;
    margin-left: 9.77%;

`;

const TranID = styled(StyledTd)`
    width: 29.17%;

    @media (max-width: 1752px) {
        & > :first-child {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        & {
            margin: 0 20px;
        }
    }
`;

const MyRate = styled(StyledTd)`
    width: 5.78%;
`;

const ExchangeRate = styled(StyledTd)`
    width: 9.84%;
`;


const Client = styled(StyledTd)`
    width: 4.78%;
`;

const Reqs = styled(StyledTd)`
    width: 12.83%;
`;

const Start = styled(StyledTd)`
    width: 7.7%;
`;

const End = styled(StyledTd)`
    width: 5.99%;
`;

const Status = styled(StyledTd)`
    width: 144px;
    gap: 8px;
    justify-content: start;
    margin-left: 4.42%;

`;

const StatusTitle = styled.span`
    width: 100%;
    margin-left: 32px;
`;

const Tr = styled.tr`
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 24px;
    align-items: center;
`;

const BodyTr = styled(Tr)`
    border-radius: 16px;
    background: radial-gradient(101.5% 101.5% at 50% 50%, rgba(254, 254, 254, 0.45) 0%, rgba(225, 227, 221, 0.43) 44.79%, rgba(116, 125, 97, 0.36) 100%);
    padding: 24px;
`;

const StyledRow = styled.div`
    width: 73vw;
    display: flex;

    color: #0F0021;
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    @media (max-width: 1500px) {
        font-size: 14px;
    }
`;

const HeadRow = styled(StyledRow)`
    justify-content: space-evenly;

    color: #46404B;
    text-align: center;

    font-family: 'Mulish', serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    @media (max-width: 1500px) {
        font-size: 12px;
    }
    @media (max-width: 1296px) {
        font-size: 10px;
    }
`;

const Value = styled.div`
    display: flex;
    gap: 8px;
    justify-content: end;
    align-items: center;
`;


const RateWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
`;

const FirstLine = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SecondLine = styled.span`
    color: #46404B;
    text-align: center;

    font-family: 'Mulish', serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    @media (max-width: 1500px) {
        font-size: 8px;
    }
    @media (max-width: 1196px) {
        font-size: 6px;
    }
`;


const StatusText = styled.span`
    display: block;
    background: linear-gradient(135deg, #3F9AEF 31.21%, #7BFFE7 121.47%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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

const SubmitTransactionWrapper = styled.div`
    display: flex;
    gap: 16px;
    justify-content: center;
    align-items: center;
    margin-top: 16px;
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


const InputActiveTransactions = () => {
  const handleClick = (transactionId: string, status: TransactionStatus) => {
    webSocketService.sendMessageChangeTransactionStatus(transactionId, status);
  };

  const transactions = useSelector(
      (state: RootState) => state.webSocket.transactions.filter(t => t.type == TransactionType.DEPOSIT)
  );

  return (
    <StyledTable>
      <thead>
      <Tr>
        <HeadRow>
          <Bank></Bank>
          <TranID><TranIDTitle>ID Сделки</TranIDTitle></TranID>
          <MyRate>Мой курс</MyRate>
          <ExchangeRate>Курс биржи</ExchangeRate>
          <Client>Клиент</Client>
          <Reqs>Мои реквизиты</Reqs>
          <Start>Создана</Start>
          <End>Подтверждена</End>
          <Status><StatusTitle>Статус</StatusTitle></Status>
        </HeadRow>
      </Tr>
      </thead>
      <tbody>
      {transactions?.map((t, index) => {
        return (
          <TransactionRow key={t.id}
                          onClick={handleClick}
                          t={t}
          />
        )
      })}
      </tbody>
    </StyledTable>
  );
};


interface RowProps {
  t: TransactionProps;
  onClick: (transactionId: string, status: TransactionStatus) => void;
}

const TransactionRow = ({ t, onClick }: RowProps) => {
  const [remainingTime, setRemainingTime] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const updateRemainingTime = (timerId: number) => {
      const currentTime = Number(new Date());
      const createdAt = Number(new Date(t.created_at));
      const timeDiff = Math.max(15 * 60 - Math.floor((currentTime - createdAt) / 1000), 0); // 15 минут в секундах
      const minutes = Math.floor(timeDiff / 60);
      const seconds = timeDiff % 60;
      setRemainingTime(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);

      if (timeDiff <= 0) {
        clearInterval(timerId);
        t.status = TransactionStatus.DISPUTING;
        dispatch(updateTransaction(t));
      }
    };

    const timerId = setInterval(updateRemainingTime, 1000);
    updateRemainingTime(timerId);

    return () => clearInterval(timerId);
  }, [t.created_at]);

  const BankIcon = BankIcons[1] || null;

  return (
    <BodyTr>
      <StyledRow>
        <Bank>
          <BankIcon size={32}/>
          <Value>
            <TetherIcon size={24}/>
            <FirstLine>{(Number(t.amount) / Number(t.amount)).toPrecision(4)}₮</FirstLine>
          </Value>
        </Bank>
        <TranID><span>{t.id}</span></TranID>
        <MyRate>
          <RateWrapper>
            <FirstLine>{t.actual_amount}₴</FirstLine>
            <SecondLine>3,75%</SecondLine>
          </RateWrapper>
        </MyRate>
        <ExchangeRate>
          <RateWrapper>
            <FirstLine>{t.actual_amount}₴</FirstLine>
            <SecondLine>BINANCE</SecondLine>
          </RateWrapper>
        </ExchangeRate>
        <Client>
          <RateWrapper>
            <FirstLine>{t.merchant}</FirstLine>
            <SecondLine>0 l 0₮</SecondLine>
          </RateWrapper>
        </Client>
        <Reqs>
          <RateWrapper>
            <FirstLine>{t.trader_bank_details.title} {t.trader_bank_details.card_number}</FirstLine>
            <SecondLine>{t.trader_bank_details.cardholder_name}</SecondLine>
          </RateWrapper>
        </Reqs>
        <Start>
          <RateWrapper>
            <FirstLine>{formatTime(t.created_at)}</FirstLine>
            <SecondLine>{formatDate(t.created_at)}</SecondLine>
          </RateWrapper>
        </Start>
        <End>
          <RateWrapper>
            <FirstLine>-</FirstLine>
          </RateWrapper>
        </End>
        <Status>
          {t.use_automation && <AutomationIcon size={24} useGradient={true}/>}
          <StatusText>Ожидание</StatusText>
        </Status>
      </StyledRow>
      <SubmitTransactionWrapper>
        <Button style={{width: "284px"}}
                onClick={() => onClick(t.id, TransactionStatus.COMPLETED)}
        >
          Подтвердить
        </Button>
        <CancelButton onClick={() => onClick(t.id, TransactionStatus.FAILED)}>
          Отменить сделку
        </CancelButton>
        <Timer>{remainingTime}</Timer>
      </SubmitTransactionWrapper>
    </BodyTr>
  )
};

export default InputActiveTransactions;
