import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  Button, FieldWrapper,
  PageWrapper,
  StyledField,
  StyledH1,
  StyledH2Regular,
  StyledH3Bold
} from "../../UI/CommonUI";
import {SnowFlakeIcon, TetherIcon} from "../../UI/SVG";
import styled, {ThemeContext} from "styled-components";
import MerchantHeader from "../../components/merchant/MerchantHeader";
import Withdrawals from "../../views/merchant/Withdrawals";
import {useFormik} from "formik";
import * as Yup from "yup";
import DropDown from "../../components/common/DropDown";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 1500px;
    margin: 64px 362px 0;
`;

const Balances = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 32px;
`;

const BalanceWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;


const ActiveBalance = styled.span`
    color: ${({theme}) => theme.theme_accent};

    font-weight: 700;
    font-size: 32px;
`;

const FrozenBalance = styled.span`
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background: ${({theme}) => theme.frozen_balance_text_color};
    background-clip: text;

    font-size: 22px;
`;

const WithdrewWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
`;

const Withdrew = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    color: ${({theme}) => theme.theme_accent};
`;

const FormWrapper = styled.div`
    background: linear-gradient(180deg, rgba(120, 124, 113, 0.45) -148.5%, rgba(255, 255, 255, 0.45) 8.66%, rgba(116, 125, 97, 0.36) 248.5%);
    width: 436px;
    padding: 32px 24px 40px;
    border-radius: 8px;
`;

const Label = styled.label`
    color: ${({theme}) => theme.grey};
    font-family: 'Mulish', serif;
    font-size: 14px;
    font-weight: 400;

    margin-bottom: 4px;
    display: flex;
    
    &:not(:first-child) {
        margin-top: 16px;
    }
`;

const Description = styled.p`
    font-size: 16px;
    color: ${({theme}) => theme.grey};
    display: inline-flex;
`;

const DescriptionWrapper = styled.div`
    display: flex;
    gap: 4px;
    align-items: start;
    margin-top: 32px;
`;

const StyledAsterisk  = styled(StyledH1)`
    color: ${({theme}) => theme.theme_accent};
    display: flex;
`;

const FirstLine = styled.div`
    display: flex;
    justify-content: space-between;
`;

const MerchantBalancePage = () => {
  const theme = useContext(ThemeContext);
  const [formIsActive, setFormIsActive] = useState<boolean>(false);

  const currencies = [{label: 'Tether', value: 'USDT'}, {label: 'Гринва', value: 'UAH'}];

  const formik = useFormik({
    initialValues: {
      amount: '',
      wallet: '',
      currency: currencies[0].value,
    },
    validationSchema: Yup.object({
      amount: Yup.number().required('Amount required'),
      wallet: Yup.string().required('Wallet required'),
      currency: Yup.string().required('Currency required'),
    }),
    onSubmit: async (values) => {
      try {
        // TODO: implement request
        alert(`Request to withdraw ${values.amount} ${values.currency} to ${values.wallet} wallet.`);
        setFormIsActive(false);
      } catch (error) {
        console.error('Ошибка оформления заявки на вывод:', error);
      }
    },
  });

  const handleCurrencyChange = (selectedOption: any) => {
    formik.setFieldValue('currency', selectedOption.value);
  };

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setFormIsActive(false);
        formik.resetForm();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [formRef]);


  return (
    <PageWrapper>
      <MerchantHeader/>
      <ContentWrapper>
        <StyledH1>Баланс</StyledH1>

        <Balances>
          <BalanceWrapper>
            <ActiveBalance>10 573</ActiveBalance>
            <TetherIcon size={32} fill={theme?.theme_accent}/>
          </BalanceWrapper>
          <BalanceWrapper>
            <FrozenBalance>5 438</FrozenBalance>
            <SnowFlakeIcon size={24}/>
          </BalanceWrapper>
        </Balances>

        {!formIsActive ?
          <Button style={{width: "284px", marginTop: "16px"}}
                  onClick={() => setFormIsActive(true)}
          >
            Вывести
          </Button>
          :
          <FormWrapper ref={formRef}>
            <form onSubmit={formik.handleSubmit}>
              <FirstLine>
                <div>
                  <Label>Введите сумму</Label>
                  <FieldWrapper style={{width:"240px"}}
                  >
                    <StyledField name="amount"
                                 type="text"
                                 onChange={formik.handleChange}
                                 value={formik.values.amount}
                    />
                  </FieldWrapper>
                </div>
                <div>
                  <Label>Валюта</Label>
                  <DropDown options={currencies}
                            width={"132px"}
                            height={'37px'}
                            value={currencies.find(c => c.value === formik.values.currency)}
                            onChange={handleCurrencyChange}
                  />
                </div>
              </FirstLine>
              <Label>Введите адресс кошелька</Label>
              <FieldWrapper style={{width:"100%"}}>
                <StyledField name="wallet"
                             type="text"
                             onChange={formik.handleChange}
                             value={formik.values.wallet}
                />
              </FieldWrapper>

              <Button style={{width: "100%", marginTop: "24px"}}
                      type={"submit"}
              >
                Подтвердить
              </Button>

              <DescriptionWrapper>
                <StyledAsterisk>*</StyledAsterisk>
                <Description>Вывод на карту осуществляется после обработки заявки Администратором</Description>
              </DescriptionWrapper>
            </form>
          </FormWrapper>
        }


        <StyledH3Bold style={{marginTop: '32px'}}>История операций</StyledH3Bold>

        <WithdrewWrapper>
          <StyledH2Regular>Выведено:</StyledH2Regular>
          <Withdrew>
            <StyledH2Regular>0₮</StyledH2Regular>
            <StyledH2Regular>0₴</StyledH2Regular>
          </Withdrew>
        </WithdrewWrapper>

        <Withdrawals/>

      </ContentWrapper>
    </PageWrapper>
  );
};

export default MerchantBalancePage;
