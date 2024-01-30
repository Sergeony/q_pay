import React from 'react';
import {Formik, Form, useFormik} from 'formik';
import * as Yup from 'yup';
import Header from '../../components/common/Header';
import styled from "styled-components";
import {
  Button,
  Container,
  PageWrapper,
  LoginFieldWrapper,
  RegistrationH2,
  StyledContainer,
  StyledField, StyledLabel
} from "../../UI/CommonUI";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {loginUser, verifyUserOtp} from "../../slices/userSlice";
import {unwrapResult} from "@reduxjs/toolkit";


const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});


const StyledGird = styled(Container)`
    row-gap: 0;
`;

const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.field_text_color};
`;

const Block = styled.div`
    grid-column: 2/3;
`;

const LoginStep1 = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required('Required'),
      password: Yup.string()
        .required('Required'),
    }),
    onSubmit: (values) => {
      dispatch(loginUser({
        email: formik.values.email || "",
        password: formik.values.email || "",
      }))
        .then(unwrapResult)
        .then(() => {
          if (userState.user?.otpBase32) {
            navigate("/sign-up/2/");
          } else {
            navigate("/sign-in/2/");
          }
        })
        .catch((error) => {
          console.error('Ошибка авторизации:', error);
          // Обработка ошибки, например, отображение сообщения об ошибке
        });
    },
  });

  return (
    <>
      <Block>
        <RegistrationH2>Вход</RegistrationH2>
      </Block>
      <Block>
        <form onSubmit={formik.handleSubmit}>
          <LoginFieldWrapper>
            <StyledLabel>Адрес электронной почты</StyledLabel>
            <StyledContainer>
              <DefaultField name="email"
                            type="email"
                            placeholder="Адрес электронной почты"
                            onChange={formik.handleChange}
                            value={formik.values.email}
              />
            </StyledContainer>
          </LoginFieldWrapper>

          <LoginFieldWrapper>
            <StyledLabel>Введите пароль</StyledLabel>
            <StyledContainer>
              <DefaultField name="password"
                            type="password"
                            placeholder="Введите пароль"
                            onChange={formik.handleChange}
                            value={formik.values.password}
              />
            </StyledContainer>
          </LoginFieldWrapper>

          <Button type="submit">Вход</Button>
        </form>
      </Block>
    </>
  );
};

export default LoginStep1;
