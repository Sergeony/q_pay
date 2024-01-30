import React from 'react';
import styled from "styled-components";
import {
  StyledCopyIcon,
  BackArrow,
  Button,
  LoginFieldWrapper,
  RegistrationH2, StyledContainer, StyledField, BackButton
} from "../../UI/CommonUI";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import RegistrationPage from "../../pages/common/RegistrationPage";
import {useNavigate} from "react-router-dom";


const RegistrationSchema = Yup.object().shape({
  code: Yup.string().required('Required'),
});



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

  const navigate = useNavigate();
  const handleNextStep = () => {
    navigate("/sign-up/3/");
  }

  return (
    <>
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
          onSubmit={(values) => {
            return
          }}
        >
          <Form>
            <LoginFieldWrapper>
              <StyledContainer id="codeField" onClick={copyCode}>
                <StyledCopyIcon/>
                <StyledField value='A2B13B511B3GSDF1' readOnly/>
              </StyledContainer>
            </LoginFieldWrapper>
            <Button type="submit" onClick={handleNextStep}>Далее</Button>
          </Form>
        </Formik>
        <BackButton href="/login">Назад</BackButton>
      </ThirdBlock>
    </>

  );
};

export default RegistrationStep2;
