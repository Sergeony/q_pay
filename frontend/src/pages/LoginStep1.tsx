import React from 'react';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
import Header from '../components/Header';
import styled from "styled-components";
import {
  RegisterButton,
  Container,
  PageWrapper,
  FieldWrapper,
  RegistrationH2,
  StyledContainer,
  StyledField, StyledLabel
} from "../UI/CommonUI";


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
  return (
    <PageWrapper>
      <Header/>
      <StyledGird>
        <Block>
          <RegistrationH2>Вход</RegistrationH2>
        </Block>
        <Block>
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={RegistrationSchema}
            onSubmit={() => { return }}
          >
            <Form>
              <FieldWrapper>
                <StyledLabel>Адрес электронной почты</StyledLabel>
                <StyledContainer>
                  <DefaultField name="email" type="email" placeholder="Адрес электронной почты"/>
                </StyledContainer>
              </FieldWrapper>

              <FieldWrapper>
                <StyledLabel>Введите пароль</StyledLabel>
                <StyledContainer>
                  <DefaultField  name="password" type="password" placeholder="Введите пароль"/>
                </StyledContainer>
              </FieldWrapper>

              <RegisterButton type="submit">Вход</RegisterButton>
            </Form>
          </Formik>
        </Block>
      </StyledGird>
    </PageWrapper>
  );
};

export default LoginStep1;
