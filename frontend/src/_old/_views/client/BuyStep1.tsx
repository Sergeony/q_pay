import React, { useState } from 'react';
import { BankIcons, CheckIcon2 } from "../../__UI/SVG";
import {Button, StyledField} from "../../__UI/CommonUI";
import styled from "styled-_components";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {TransactionType} from "../../_service/transactionsService";
import {useCreateTransactionMutation} from "../../_service/clientService.ts.ts";


const ContentWrapper = styled.div`
  grid-column-gap: 20px;
  width: 436px;
  margin: 97px auto 0;
  font-family: 'Helvetica', serif;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

export const StyledContainer = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 16px;
  border: ${({theme}) => theme.field_border};
  background: ${({theme}) => theme.field_background};
  width: 436px;
`;


const Section = styled.section`
  margin-top: 32px;
`;

const OptionTitle = styled.div`
  margin-bottom: 8px;
  color: #46404B;
  font-size: 18px;
  font-weight: 400;
`;

const DefaultField = styled(StyledField)`
  color: ${({theme}) => theme.field_text_color};
`;


const Banks = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  gap: 16px;
`;

const CheckWrapper = styled.span`
  border-radius: 50%;
  background-color: #9E68F7;
  position: absolute;
  top: 17px;
  right: 17px;
  width: 21px;
  height: 21px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledCheck = styled(CheckIcon2)`
  fill: white;
`;


const Bank = styled.div<{ isSelected: boolean }>`
  border-radius: 16px;
  width: 96px;
  height: 96px;
  background: linear-gradient(180deg, rgba(120, 124, 113, 0.45) -148.5%, rgba(255, 255, 255, 0.45) 8.66%, rgba(116, 125, 97, 0.36) 248.5%);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: ${({isSelected}) => isSelected ? '2px solid #9E68F7' : 'none'};
`;

const MerchantTitle = styled.h2`
  color: #9E68F7;
  font-size: 28px;
  font-weight: 700;
  text-decoration: underline;
`;


const BuyStep1 = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const navigate = useNavigate();
  const [createTransaction] = useCreateTransactionMutation();
  const merchName = 'merchant.com';  // TODO: possibly, move to integration model get out there

  const formik = useFormik({
    initialValues: {
      amount: undefined,
      bankId: undefined,
      email: '',
    },
    validationSchema: Yup.object().shape({
      amount: Yup.number().required('Сумма обязательна'),
      bankId: Yup.number().required('Банк обязателен'),
      email: Yup.string().email(),
    }),
    onSubmit: async (values) => {
      if (!values.amount || !values.bankId) {
        return
      }
      await createTransaction({
        amount: values.amount,
        client_bank_id: values.bankId,
        type: TransactionType.DEPOSIT,
        order_id: `${Math.round(Math.random() * 1000)}`,
        client_id: `${Math.round(Math.random() * 1000)}`,
      })
        .unwrap()
        .then(() => {
          navigate("/client/buy/3/");
        })
        .catch(() => {
          navigate("/client/buy/7/");
        })
    }
  });

  const handleBankSelect = (bankId: string) => {
    formik.setFieldValue('bankId', bankId);
    setSelectedBank(bankId);
  };

  return (
    <ContentWrapper>
      <MerchantTitle>{merchName}</MerchantTitle>
      <form onSubmit={formik.handleSubmit}>
        <Section>
          <OptionTitle>Введите сумму</OptionTitle>
          <StyledContainer>
            <DefaultField
              placeholder="Введите сумму"
              type="text"
              name="amount"
              onChange={formik.handleChange}
              value={formik.values.amount}
              onBlur={formik.handleBlur}/>
          </StyledContainer>
        </Section>
        <Section>
          <OptionTitle>Выберите способ оплаты</OptionTitle>
          <Banks>
            {Object.entries(BankIcons).map(([bankId, Value]) => (
              <Bank
                key={bankId}
                onClick={() => handleBankSelect(bankId)}
                isSelected={selectedBank == bankId}>
                  {selectedBank === bankId &&
                    <CheckWrapper>
                      <StyledCheck/>
                    </CheckWrapper>
                  }
                <Value size={32}/>
              </Bank>
            ))}
          </Banks>
        </Section>
        <Section>
          <OptionTitle>Введите email для получения чека</OptionTitle>
          <StyledContainer>
            <DefaultField
              placeholder="Введите email"
              type="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              onBlur={formik.handleBlur}/>
          </StyledContainer>
        </Section>
        <Button style={{marginTop: '32px'}} type='submit'>Подтвердить</Button>
      </form>
    </ContentWrapper>
  );
};

export default BuyStep1;
