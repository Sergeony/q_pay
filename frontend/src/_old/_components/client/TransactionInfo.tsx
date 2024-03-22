import React from 'react';
import styled from "styled-_components";
import { BankIcons } from "../../../src_old/__UI/SVG";
import { ClientTransactionProps } from "_store/reducers/clientTransactionSlice";


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

type TransactionInfoProps = {
  transaction: ClientTransactionProps;
};

const TransactionInfo: React.FC<TransactionInfoProps> = ({transaction}) => {
  const Bank = BankIcons[transaction?.client_bank.id];

  return (
    <Article>
      <DealTitle>ИНФОРМАЦИЯ О СДЕЛКЕ:</DealTitle>
      <DL>
        <DItem>
          <DT>Вы отдаете:</DT>
          <DD>{transaction?.amount * 38}грн</DD>
        </DItem>
        <DItem>
          <DT>Вы получаете:</DT>
          <DD>{Math.round(transaction?.amount_to_deposit * 38 * 100) / 100}грн</DD>
        </DItem>
        <DItem>
          <DT>Способ оплаты:</DT>
          <DD><Bank size={24}/>{transaction?.client_bank.title}</DD>
        </DItem>
        <DItem>
          <DT>ID Сделки:</DT>
          <DD>{transaction?.id}</DD>
        </DItem>
      </DL>
    </Article>
  );
};

export default TransactionInfo;
