import React from 'react';
import Header from '../../components/common/Header';
import {
  Container,
  PageWrapper,
} from "../../UI/CommonUI";


interface IProps {
  children: React.ReactNode;
}


const UnauthorizedPage = ({children}: IProps) => {
  return (
    <PageWrapper>
      <Header/>
      <Container>
        {children}
      </Container>
    </PageWrapper>
  );
};

export default UnauthorizedPage;
