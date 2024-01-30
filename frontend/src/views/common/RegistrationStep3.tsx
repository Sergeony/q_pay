import React from 'react';
import styled from "styled-components";
import {
  BackArrow,
  Button,
  LoginFieldWrapper,
  RegistrationH2,
  StyledField,
  StyledContainer,
  StyledPasteIcon
} from "../../UI/CommonUI";
import {Form, Formik} from 'formik';
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";


const RegistrationSchema = Yup.object().shape({
  code: Yup.string().required('Required'),
});


const LoginA = styled.a`
    display: flex;
    justify-content: center;
    margin-top: 16px;
    color: ${({theme}) => theme.back_text_color};
    font-family: "Helvetica", serif;
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

const RegistrationStep3 = () => {

  const copyCode = () => {
    navigator.clipboard.writeText("some code...");
  };

  const navigate = useNavigate();
  const handleNextStep = () => {
    navigate("/sign-up/4/");
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
          Введите только что сохраненный 16-значный ключ
        </DescriptionDiv>
        <Formik
          initialValues={{code: 'A2B13B511B3GSDF1'}}
          validationSchema={RegistrationSchema}
          onSubmit={() => {
            return
          }}
        >
          <Form>
            <LoginFieldWrapper>
              <StyledContainer id="codeField" onClick={copyCode}>
                <StyledPasteIcon/>
                <StyledField value='A2B13B511B3GSDF1'/>
              </StyledContainer>
            </LoginFieldWrapper>

            <Button type="submit" onClick={handleNextStep}>Далее</Button>
          </Form>
        </Formik>
        <LoginA href="/login">Назад</LoginA>
      </ThirdBlock>
    </>

  );
};

export default RegistrationStep3;
