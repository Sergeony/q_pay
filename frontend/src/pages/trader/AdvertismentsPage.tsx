import React from 'react';
import {Formik, Form} from 'formik';
import * as Yup from 'yup';
import Header from '../../components/Header';
import styled from "styled-components";
import {
  RegisterButton,
  Container,
  PageWrapper,
  FieldWrapper,
  RegistrationH2,
  StyledContainer,
  StyledField, StyledLabel
} from "../../UI/CommonUI";
import UserHeader from "../../components/UserHeader";
import TabHeader from "../../components/TabHeader";


const RegistrationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
});


const StyledGird = styled(Container)`
    row-gap: 0;
`;

const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.field_text_color};
`;

const Block = styled.div`
    grid-column: 2/3;
`;

const LoginStep1 = () => {
  return (
    <PageWrapper>
      <UserHeader/>
      <TabHeader/>
    </PageWrapper>
  );
};

export default LoginStep1;
