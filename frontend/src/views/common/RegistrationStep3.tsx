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
import {useFormik} from 'formik';
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";


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
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const getTextFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();

      if (text !== null) {
        await formik.setFieldValue('otpInput', text);
      }
    } catch (error) {
      console.error('Ошибка при чтении из буфера обмена:', error);
      return null;
    }
  }

  const formik = useFormik({
    initialValues: {
      otpInput: '',
    },
    validationSchema: Yup.object({
      otpInput: Yup.string()
        .required('Required')
        .test('match', 'Invalid OTP Code', (otpInput) => {
          return otpInput === authState.auth?.otpBase32;
        }),
    }),
    onSubmit: () => {
      navigate("/sign-up/4/");
    },
  });

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
        <form onSubmit={formik.handleSubmit}>

          <LoginFieldWrapper>
            <StyledContainer id="codeField" onClick={getTextFromClipboard}>
              <StyledPasteIcon/>
              <StyledField name="otpInput"
                           onChange={formik.handleChange}
                           value={formik.values.otpInput}/>
            </StyledContainer>
          </LoginFieldWrapper>

          {formik.touched.otpInput && formik.errors.otpInput ? (
            <div>{formik.errors.otpInput}</div>
          ) : null}

          <Button type="submit" style={{marginTop: "32px"}}>Далее</Button>
        </form>
        <LoginA href="/login">Назад</LoginA>
      </ThirdBlock>
    </>

  );
};

export default RegistrationStep3;
