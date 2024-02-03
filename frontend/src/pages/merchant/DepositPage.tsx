import React from 'react';
import styled from "styled-components";
import {
  PageWrapper,
} from "../../UI/CommonUI";
import TabHeader from "../../components/common/TabHeader";
import Search from "../../components/common/Search";
import {NavLink, Route, Routes} from "react-router-dom";
import InputActiveTransactions from "../../views/trader/InputActiveTransactions";
import InputCompletedTransactions from "../../views/trader/InputCompletedTransactions";
import InputDisputedTransactions from "../../views/trader/InputDisputedTransactions";
import MerchantHeader from "../../components/merchant/MerchantHeader";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 78.13vw;
    margin: 0 auto;
`;

const TitleWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-column-gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-top: 78px;
    margin-bottom: 32px;
`;


const Title = styled.span`
    font-family: 'Mulish', serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0;
    text-align: left;
    color: #0F0021;
    font-style: normal;
    line-height: normal;

    grid-column: 2/4;

`;

const SearchWrapper = styled.div`
    grid-column: 4/7;
`;

const StyledNav = styled.nav`
    display: flex;
    width: 1049px;
    margin-left: 152px;
    justify-content: space-between;
`;

const TabLink = styled(NavLink)`

    font-family: 'Helvetica', serif;
    font-size: 18px;
    font-style: normal;
    text-decoration: none;
    color: #6B48A4;
    font-weight: 400;

    &.active {
        color: #0F0021;
        font-weight: 700;
    }
`;


const DepositPage = () => {
  return (
    <PageWrapper>
      <MerchantHeader/>
      <ContentWrapper>
        <TitleWrapper>
          <Title>Пополнение</Title>
          <SearchWrapper>
            <Search placeholder={"ID Сделки"}
                    onSearch={() => {
                      console.log("search precessed")
                    }}
            />
          </SearchWrapper>
        </TitleWrapper>

        <StyledNav>
          <TabLink to={"/deposit/awaiting-processing/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Ожидает обработки</TabLink>
          <TabLink to={"/deposit/in-processing/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >В обработке</TabLink>
          <TabLink to={"/deposit/awaiting-settlement/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Ожидает сеттльмент</TabLink>
          <TabLink to={"/deposit/settlement-completed/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Сеттльмент выполнен</TabLink>
          <TabLink to={"/deposit/cancelled/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Отмененные</TabLink>
          <TabLink to={"/deposit/dispute/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Споры</TabLink>
        </StyledNav>

        <Routes>
          <Route path={'/awaiting-processing/'}
                 element={<InputActiveTransactions/>}
          />
          <Route path={'/in-processing/'}
                 element={<InputCompletedTransactions/>}
          />
          <Route path={'/awaiting-settlement/'}
                 element={<InputDisputedTransactions/>}
          />
          <Route path={'/settlement-completed/'}
                 element={<InputDisputedTransactions/>}
          />
          <Route path={'/cancelled/'}
                 element={<InputDisputedTransactions/>}
          />
          <Route path={'/dispute/'}
                 element={<InputDisputedTransactions/>}
          />
        </Routes>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default DepositPage;
