import React, {useEffect} from 'react';
import styled from "styled-components";
import {
  StyledCopyIcon,
  BackArrow,
  Button,
  LoginFieldWrapper,
  RegistrationH2, StyledContainer, StyledField, BackButton
} from "../../UI/CommonUI";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useLoginUserMutation} from "../../service/authService";


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
  const authState = useSelector((state: RootState) => state.auth);
  const [loginUser] = useLoginUserMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogin = async () => {
      if (!authState.auth.otpBase32) {
        await loginUser({
          email: authState.auth.email,
          password: authState.auth.password
        })
          .unwrap()
          .catch((error) => {
            console.error('Ошибка авторизации:', error);
          });
      } else {
        console.error("OTP has already been saved. So you shouldn't have been redirected here.")
      }
    };
    performLogin();
  }, []);

  const copyCode = async () => {
    await navigator.clipboard.writeText(authState.auth?.otpBase32);
  };

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
        <LoginFieldWrapper>
          <StyledContainer id="codeField" onClick={copyCode}>
            <StyledCopyIcon/>
            <StyledField value={authState.auth?.otpBase32} readOnly/>
          </StyledContainer>
        </LoginFieldWrapper>
        <Button type="submit" onClick={handleNextStep} style={{marginTop: "32px"}}>Далее</Button>
        <BackButton href="/login">Назад</BackButton>
      </ThirdBlock>
    </>
  );
};

export default RegistrationStep2;
