import React from 'react';
import styled from 'styled-components';
import {ChevronIcon, CopyIcon} from "../UI/SVG";

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 436px 1fr;
    margin-top: 97px;

    & > :nth-child(3){ 
        grid-column: 2 / 3;
    }
`;

const Block = styled.div`
    border: 1px solid #ccc; /* Просто для наглядности */
    box-sizing: border-box;
    gap: 5px;
`;


const BackArrow = styled(ChevronIcon)`
    stroke: black;
    rotate: 90deg;
`;

const RegistrationH2 = styled.h2`
    font-family: 'Mulish', serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 35px;
    letter-spacing: 0;
    text-align: left;
    color: ${({theme}) => theme.form_title};
`;

const RegistrationFormWrapper = styled.div`
    width: 436px;
    margin: 0 auto;
`;

const FieldWrapper = styled.div`
    margin-top: 32px;
`;

const RegisterButton = styled.button`
    margin-top: 32px;
    width: 436px;
    height: 44px;
    top: 858px;
    left: 742px;
    padding: 12px 0;
    border-radius: 16px;
    border: none;
    background-color: ${({theme}) => theme.register_button_background_color};

    color: ${({theme}) => theme.register_button_text_color};
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0;
    text-align: center;

`;


const StyledField = styled.div`
    display: flex;
    width: 436px;
    height: 56px;
    padding: 16px;
    border-radius: 16px;
    border: ${({theme}) => theme.field_border};
    gap: 16px;
    background: ${({theme}) => theme.field_background};

    color: ${({theme}) => theme.field_text_color};
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;

    &::placeholder {
        color: ${({theme}) => theme.field_placeholder_color};
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        background: ${({theme}) => theme.field_background};
        color: ${({theme}) => theme.field_text_color};
        transition: color 5000s ease-in-out 0s, background 5000s ease-in-out 0s;
    }
`;

const LoginWrapper = styled.div`
    display: flex;
    margin-top: 32px;
    gap: 8px;
    justify-content: center;

    font-family: "Helvetica Neue", serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    text-align: left;
`;

const LoginA = styled.a`
    color: ${({theme}) => theme.login_button_text_color};
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

const StyledCopyIcon = styled(CopyIcon)`
    fill: #AFB4A8;
`;


const MyPage = () => {
  const copyCode = () => {
    navigator.clipboard.writeText("some code...");
  };

  return (
    <Container>
      <Block>
        <BackArrow/>
      </Block>
      <Block>
        <RegistrationH2>Верификация</RegistrationH2>
      </Block>
      <Block>
        <RegistrationFormWrapper>
          <DescriptionDiv>
            Сохраните этот ключ на бумаге и храните его в надежном месте. Если вы потеряете свое устройство,
            этот ключ позволит вам восстановить свой аккаунт Google Authenticator.
          </DescriptionDiv>
          <FieldWrapper>
            <StyledField id="codeField" onClick={copyCode}>
              <StyledCopyIcon/>
              32ый код
            </StyledField>
          </FieldWrapper>


          <RegisterButton type="submit">Далее</RegisterButton>
          <LoginWrapper>
            <LoginA href="/login">Назад</LoginA>
          </LoginWrapper>
        </RegistrationFormWrapper>
      </Block>
    </Container>
  );
};

export default MyPage;
