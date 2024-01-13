import React from 'react';
import Header from '../components/Header';
import styled from "styled-components";
import {
  BackArrow,
  RegisterButton,
  Container,
  PageWrapper,
  RegistrationH2,
} from "../UI/CommonUI";
import  googleAuthenticatorLogo from "../assets/img/google_authenticator_logo.png";


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

const DescriptionDiv = styled.div`
    margin-top: 56px;

    font-family: "Mulish", serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0;
    text-align: center;

    color: ${({theme}) => theme.description_text_color};
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

const GoogleAuthenticatorLogo1 = styled.img`
    width: 224px;
`;


const RegistrationStep3 = () => {

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
          <GoogleAuthenticatorLogo1
            src={googleAuthenticatorLogo}
            alt="Google authenticator logo"
          />
          <DescriptionDiv>
            Вам нужно будет добавить учетную запись QPay в приложение Google Authenticator и вручную ввести 16-значный ключ.
          </DescriptionDiv>
          <RegisterButton type="submit">Далее</RegisterButton>

          <LoginA href="/login">Назад</LoginA>
        </ThirdBlock>
      </Container>
    </PageWrapper>
  );
};

export default RegistrationStep3;
