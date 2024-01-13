import styled from "styled-components";
import {ChevronIcon, CopyIcon, PasteIcon} from "./SVG";
import {Field} from "formik";


export const PageWrapper = styled.div`
    background-image: ${({ theme }) => theme.body_background_image};
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 100vh;
    background-color: ${({ theme }) => theme.body_background_color};
`;


export const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 436px 1fr;
    margin-top: 97px;
    row-gap: 56px;
`;

export const RegistrationH2 = styled.h2`
    font-family: 'Mulish', serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 35px;
    letter-spacing: 0;
    text-align: left;
    color: ${({theme}) => theme.form_title};
`;

export const FieldWrapper = styled.div`
    margin-top: 32px;
`;

export const RegisterButton = styled.button`
    margin-top: 32px;
    width: 436px;
    height: 44px;
    top: 858px;
    left: 742px;
    padding: 12px 0;
    border-radius: 16px;
    border: none;
    background-color: ${({ theme }) => theme.register_button_background_color};

    color: ${({ theme }) => theme.register_button_text_color};
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    letter-spacing: 0;
    text-align: center;

`;

export const StyledCopyIcon = styled(CopyIcon)`
    fill: #AFB4A8;
    margin-right: 16px;
`;

export const StyledPasteIcon = styled(PasteIcon)`
    fill: #AFB4A8;
    margin-right: 16px;
`;


export const BackArrow = styled(ChevronIcon)`
    stroke: ${({theme}) => theme.back_arrow_color};
    rotate: 90deg;
    width: 32px;
    height: 32px;
`;


export const StyledContainer = styled.div`
    display: flex;
    padding: 16px;
    border-radius: 16px;
    border: ${({theme}) => theme.field_border};
    background: ${({theme}) => theme.field_background};
`;

export const StyledField = styled(Field)`
    color: ${({theme}) => theme.theme_accent};
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-weight: 400;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;
    background: none;
    width: 100%;
    border: none;

    &::placeholder {
        color: ${({theme}) => theme.field_placeholder_color};
    }

    &:focus {
        outline: none;
    }

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus {
        background: none;
        color: ${({theme}) => theme.field_text_color};
        transition: color 5000s ease-in-out 0s, background 5000s ease-in-out 0s;
    }
`;

export const StyledLabel = styled.div`
    font-family: "Helvetica Neue", serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0;
    text-align: left;
    color: ${({theme}) => theme.field_label_text_color};
    margin-bottom: 8px;

`;
