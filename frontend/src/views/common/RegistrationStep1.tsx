import React from 'react';
import {Formik, Form, Field} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
import {registerUser} from '../../actions/registrationActions';
import {AppDispatch} from "../../store/store";
import styled from "styled-components";
import CheckIcon from "../../UI/SVG/icons/CheckIcon";
import {CrossIcon} from "../../UI/SVG";
import {
  Button,
  LoginFieldWrapper,
  RegistrationH2,
  StyledContainer,
  StyledField, StyledLabel
} from "../../UI/CommonUI";
import RegistrationPage from "../../pages/common/RegistrationPage";
import {useNavigate} from "react-router-dom";


const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), undefined], 'Passwords must match').required('Confirm your password'),
});



const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.field_text_color};
`;

const TermsWrapper = styled.div`
    margin-top: 16px;
    width: 436px;
    gap: 8px;
    display: flex;
    align-items: start;
`;

const CheckBoxField = styled(Field)`
    margin: 2px;
    justify-self: start;

`;

const CheckBoxLabel = styled.div`
    font-family: 'Mulish', serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0;
    text-align: left;
    color: ${({theme}) => theme.terms_text_color};
`;

const LoginWrapper = styled.div`
    display: flex;
    margin-top: 32px;
    gap: 8px;
    justify-content: center;

    font-family: "Helvetica", serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    text-align: left;
`;

const AlreadyHaveAnAccountP = styled.p`
    color: ${({theme}) => theme.have_account_text_color};
`;

const LoginA = styled.a`
    color: ${({theme}) => theme.login_button_text_color};
`;

const PasswordHintsWrapper = styled.div`
    display: flex;
    margin-top: 8px;
    gap: 8px;
`;

const PasswordHint = styled.div`
    display: flex;
    font-family: "Mulish", serif;
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    letter-spacing: 0;
    text-align: center;
    color: ${({theme}) => theme.hint_text_color};
    gap: 4px;
`;

const PasswordHintCheck = styled(CheckIcon)`
    height: 16px;
    width: 16px;
    fill: ${({theme}) => theme.hint_check_color};
`;

const PasswordHintCross = styled(CrossIcon)`
    height: 16px;
    width: 16px;
    fill: ${({theme}) => theme.hint_cross_color};
`;

const Block = styled.div`
    grid-column: 2/3;
`;

const RegistrationStep1 = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const handleNextStep = () => {
    navigate("/sign-up/2/");
  }

  return (
    <>
        <Block>
          <RegistrationH2>Регистрация</RegistrationH2>
        </Block>
        <Block>
          <Formik
            initialValues={{email: '', password: '', confirmPassword: ''}}
            validationSchema={RegistrationSchema}
            onSubmit={(values) => {
              dispatch(registerUser(values));
            }}
          >
            <Form>
              <LoginFieldWrapper>
                <StyledLabel>Адрес электронной почты</StyledLabel>
                <StyledContainer>
                  <DefaultField name="email" type="email" placeholder="Адрес электронной почты"/>
                </StyledContainer>
              </LoginFieldWrapper>

              <LoginFieldWrapper>
                <StyledLabel>Придумайте пароль</StyledLabel>
                <StyledContainer>
                  <DefaultField name="password" type="password" placeholder="Придумайте пароль"/>
                </StyledContainer>
                <PasswordHintsWrapper>
                  <PasswordHint>
                    <PasswordHintCheck/>
                    заглавные(A-Z)
                  </PasswordHint>
                  <PasswordHint>
                    <PasswordHintCheck/>
                    строчные(a-z)
                  </PasswordHint>
                  <PasswordHint>
                    <PasswordHintCheck/>
                    цифры(0-9)
                  </PasswordHint>
                  <PasswordHint>
                    <PasswordHintCross/>
                    от 8 символов
                  </PasswordHint>
                </PasswordHintsWrapper>
              </LoginFieldWrapper>

              <LoginFieldWrapper>
                <StyledLabel>Повторите пароль</StyledLabel>
                <StyledContainer>
                  <DefaultField  name="confirmPassword" type="password" placeholder="Повторите пароль"/>
                </StyledContainer>
              </LoginFieldWrapper>

              <Button type="submit" onClick={handleNextStep}>Регистрация</Button>

              <TermsWrapper>
                <CheckBoxField type="checkbox" name="terms"/>
                <CheckBoxLabel>
                  Подтверждаю согласие с политикой конфиденциальности и пользовательским соглашением сервиса QPay
                </CheckBoxLabel>
              </TermsWrapper>
            </Form>
          </Formik>

          <LoginWrapper>
            <AlreadyHaveAnAccountP>Есть аккаунт?</AlreadyHaveAnAccountP>
            <LoginA href="/login">Войти</LoginA>
          </LoginWrapper>
        </Block>
    </>
  );
};

export default RegistrationStep1;
