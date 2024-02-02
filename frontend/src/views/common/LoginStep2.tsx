import React from 'react';
import styled from "styled-components";
import {
  BackArrow,
  Button,
  RegistrationH2, StyledContainer, StyledField, StyledLabel, StyledPasteIcon,
} from "../../UI/CommonUI";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useVerifyUserOtpMutation} from "../../service/authService";


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
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);
  const [verifyUserOtp] = useVerifyUserOtpMutation();

  const formik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      await verifyUserOtp({
        otp: values.otp,
        user_id: authState.auth.userId
      })
        .unwrap()
        .then(() => {
          navigate("/advertisements/");
        })
        .catch((error) => {
          console.error('Ошибка авторизации:', error);
        })
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
        <form onSubmit={formik.handleSubmit}>
          <StyledLabel>
            Введите код подтверждения Google Authenticator
          </StyledLabel>
          <CodeContainer>
            <StyledPasteIcon/>
            <CodeField type="text"
                       placeholder=""
                       name="otp"
                       onChange={formik.handleChange}
                       value={formik.values.otp}
            />
          </CodeContainer>
          <Button type="submit" style={{marginTop: "32px"}}>Завершить</Button>
        </form>
        <LoginA href="/login">Назад</LoginA>
      </ThirdBlock>
    </>
  );
};

export default LoginStep2;
