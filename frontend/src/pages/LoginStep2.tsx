import React, {useState} from 'react';
import Header from '../components/Header';
import styled from "styled-components";
import {
  BackArrow,
  RegisterButton,
  Container,
  PageWrapper,
  RegistrationH2, FieldWrapper, StyledContainer, StyledField, StyledLabel, StyledPasteIcon,
} from "../UI/CommonUI";
import googleAuthenticatorLogo from "../assets/img/google_authenticator_logo.png";
import {registerUser} from "../actions/registrationActions";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import {PasteIcon} from "../UI/SVG";

const RegistrationSchema = Yup.object().shape({
  code: Yup.string().required('Required'),
});


const LoginA = styled.a`
    display: flex;
    justify-content: center;
    margin-top: 16px;
    color: ${({theme}) => theme.back_text_color};
    font-family: "Helvetica Neue", serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    text-align: left;
    text-underline-position: under;
`;

const FirstBlock = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    padding-right: 16px;
`;

const ThirdBlock = styled.div`
    grid-column: 2 / 3;
`;

const CodeContainer = styled(StyledContainer)`
    height: 56px;
`;

const CodeField = styled(StyledField)`
    font-family: "Mulish", serif;
    font-size: 28px;
    font-weight: 400;
    line-height: 35px;
    letter-spacing: 0;
    text-align: left;
    color: ${({theme}) => theme.theme_accent};
`;


const LoginStep2 = () => {
  const [code, setCode] = useState('');

  const handleChange = (e: any) => {
    let input = e.target.value;

    input = input.replace(/\D/g, '');

    input = input.slice(0, 6);

    if (input.length > 3) {
      input = `${input.slice(0, 3)}-${input.slice(3)}`;
    }

    setCode(input);
  };

  return (
    <PageWrapper>
      <Header/>
      <Container>
        <FirstBlock>
          <BackArrow/>
        </FirstBlock>
        <div>
          <RegistrationH2>Верификация</RegistrationH2>
        </div>
        <ThirdBlock>
          <Formik
            initialValues={{email: '', password: '', confirmPassword: ''}}
            validationSchema={RegistrationSchema}
            onSubmit={() => {
              return
            }}
          >
            <Form>
                <StyledLabel>
                  Введите код подтверждения Google Authenticator
                </StyledLabel>
                <CodeContainer>
                  <StyledPasteIcon/>
                  <CodeField name="code"
                               type="text"
                               placeholder="Введите код"
                               value={code}
                               onChange={handleChange}
                               maxLenght="7"
                  />
                </CodeContainer>
            </Form>
          </Formik>
          <RegisterButton type="submit">Завершить</RegisterButton>

          <LoginA href="/login">Назад</LoginA>
        </ThirdBlock>
      </Container>
    </PageWrapper>
  );
};

export default LoginStep2;
