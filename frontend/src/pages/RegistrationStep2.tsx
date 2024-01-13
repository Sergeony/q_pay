import React from 'react';
import Header from '../components/Header';
import styled from "styled-components";
import {
  StyledCopyIcon,
  BackArrow,
  RegisterButton,
  Container,
  PageWrapper,
  FieldWrapper,
  RegistrationH2, StyledContainer, StyledField
} from "../UI/CommonUI";
import {Field, Form, Formik} from "formik";
import {registerUser} from "../actions/registrationActions";
import * as Yup from "yup";


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

const DescriptionDiv = styled.div`
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

const RegistrationStep2 = () => {

  const copyCode = () => {
    navigator.clipboard.writeText("some code...");
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
          <DescriptionDiv>
            Сохраните этот ключ на бумаге и храните его в надежном месте. Если вы потеряете свое устройство,
            этот ключ позволит вам восстановить свой аккаунт Google Authenticator.
          </DescriptionDiv>
          <Formik
            initialValues={{code: 'A2B13B511B3GSDF1'}}
            validationSchema={RegistrationSchema}
            onSubmit={(values) => { return }}
          >
            <Form>
              <FieldWrapper>
                <StyledContainer id="codeField" onClick={copyCode}>
                  <StyledCopyIcon/>
                  <StyledField value='A2B13B511B3GSDF1' readOnly/>
                </StyledContainer>
              </FieldWrapper>
              <RegisterButton type="submit">Далее</RegisterButton>
            </Form>
          </Formik>
          <LoginA href="/login">Назад</LoginA>
        </ThirdBlock>
      </Container>
    </PageWrapper>
  );
};

export default RegistrationStep2;
