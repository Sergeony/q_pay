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
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store/store";
import {loginUser} from "../../slices/userSlice";


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
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (userState.user && !userState.user.otpBase32) {
      // Предполагая, что email и password сохранены в состоянии user
      dispatch(loginUser({
        email: userState.user.email,
        password: userState.user.password,
      }));
    }
  }, [dispatch, userState.user]);

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
        <LoginFieldWrapper>
          <StyledContainer id="codeField" onClick={copyCode}>
            <StyledCopyIcon/>
            <StyledField value={userState.user?.otpBase32} readOnly/>
          </StyledContainer>
        </LoginFieldWrapper>
        <Button type="submit" onClick={handleNextStep}>Далее</Button>
        <BackButton href="/login">Назад</BackButton>
      </ThirdBlock>
    </>

  );
};

export default RegistrationStep2;
