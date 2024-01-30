import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useDispatch} from 'react-redux';
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
import {useNavigate} from "react-router-dom";
import {registerUser} from "../../slices/userSlice";
import {AppDispatch} from "../../store/store";


const registrationSchema = Yup.object().shape({
  email: Yup.string().email('Неверный формат email').required('Email обязателен'),
  password: Yup.string().min(8, 'Пароль должен содержать минимум 8 символов').required('Пароль обязателен'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
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

const CheckBoxField = styled.input`
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

  const navigate = useNavigate();
  const handleNextStep = () => {
    navigate("/sign-up/2/");
  }

  const queryParams = new URLSearchParams(location.search);
  const inviteCode = queryParams.get('invite-code');

  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: registrationSchema,
    onSubmit: (values) => {
      // Теперь вызываем registerUser как thunk-действие
      dispatch(registerUser({
        email: values.email,
        password: values.password,
        inviteCode: inviteCode || ""
      }));

      handleNextStep();
    },
  });

  return (
    <>
      <Block>
        <RegistrationH2>Регистрация</RegistrationH2>
      </Block>
      <Block>
        <form onSubmit={formik.handleSubmit}>
          <LoginFieldWrapper>
            <StyledLabel>Адрес электронной почты</StyledLabel>
            <StyledContainer>
              <DefaultField placeholder="Адрес электронной почты"
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            onBlur={formik.handleBlur}/>
            </StyledContainer>
          </LoginFieldWrapper>
          {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}

          <LoginFieldWrapper>
            <StyledLabel>Придумайте пароль</StyledLabel>
            <StyledContainer>
              <DefaultField placeholder="Придумайте пароль"
                            type="password"
                            name="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            onBlur={formik.handleBlur}/>
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
          {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}

          <LoginFieldWrapper>
            <StyledLabel>Повторите пароль</StyledLabel>
            <StyledContainer>
              <DefaultField placeholder="Повторите пароль"
                            type="password"
                            name="confirmPassword"
                            onChange={formik.handleChange}
                            value={formik.values.confirmPassword}
                            onBlur={formik.handleBlur}/>
            </StyledContainer>
          </LoginFieldWrapper>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ?
            <div>{formik.errors.confirmPassword}</div> : null}

          <Button type="submit" >Регистрация</Button>
        </form>

        <TermsWrapper>
          <CheckBoxField type="checkbox" name="terms"/>
          <CheckBoxLabel>
            Подтверждаю согласие с политикой конфиденциальности и пользовательским соглашением сервиса QPay
          </CheckBoxLabel>
        </TermsWrapper>

        <LoginWrapper>
          <AlreadyHaveAnAccountP>Есть аккаунт?</AlreadyHaveAnAccountP>
          <LoginA href="/login">Войти</LoginA>
        </LoginWrapper>
      </Block>
    </>
  );
};

export default RegistrationStep1;