import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import styled from "styled-components";
import {
  Button,
  LoginFieldWrapper,
  RegistrationH2,
  StyledContainer,
  StyledField, StyledLabel
} from "../../UI/CommonUI";
import {useNavigate} from "react-router-dom";
import {useLoginUserMutation} from "../../service/authService";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";



const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.field_text_color};
`;

const Block = styled.div`
    grid-column: 2/3;
`;


const LoginStep1 = () => {
  const [loginUser] = useLoginUserMutation();
  const authState = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email().required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      await loginUser({
        email: values.email,
        password: values.password
      })
        .unwrap()
        .then(() => {
          if (authState.auth.otpBase32)
            navigate("/sign-up/2/");
          else
            navigate("/sign-in/2/");
        })
        .catch((error) => {
          console.error('Ошибка авторизации:', error);
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

          <Button type="submit" style={{marginTop: "32px"}}>Вход</Button>
        </form>
      </Block>
    </>
  );
};
//TODO: create internal styles for button instead of the inline ones

export default LoginStep1;
