import React from 'react';
import styled from "styled-components";
import {
  PageWrapper,
} from "../../UI/CommonUI";
import TraderHeader from "../../components/trader/TraderHeader";
import TabHeader from "../../components/common/TabHeader";

import Search from "../../components/common/Search";
import {NavLink, Route, Routes, useLocation} from "react-router-dom";

import OutputActiveTransactions from "../../views/trader/OutputActiveTransactions";
import OutputCompletedTransactions from "../../views/trader/OutputCompletedTransactions";
import OutputDisputedTransactions from "../../views/trader/OutputDisputedTransactions";
import Export from "../../views/trader/Export";
import OutputReceiptTransactions from "../../views/trader/OutputReceiptTransactions";


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
    width: 589px;
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


const BuyPage = () => {
  const location = useLocation();
  const isExportPage = location.pathname.includes('/export');

  return (
    <PageWrapper>
      <TraderHeader/>
      <TabHeader/>
      <ContentWrapper>
        <TitleWrapper>
          <Title>Покупка USDT</Title>
          {!isExportPage && (
            <SearchWrapper>
              <Search placeholder={"ID Сделки"}
                      onSearch={() => {
                        console.log("search precessed")
                      }}
              />
            </SearchWrapper>
          )}
        </TitleWrapper>

        <StyledNav>
          <TabLink to={"/buy/active/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Активные</TabLink>
          <TabLink to={"/buy/receipt/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Чеки</TabLink>
          <TabLink to={"/buy/completed/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Завершенные</TabLink>
          <TabLink to={"/buy/dispute/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Споры</TabLink>
          <TabLink to={"/buy/export/"}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Экспорт</TabLink>
        </StyledNav>


        <Routes>
          <Route path={'/active/'}
                 element={<OutputActiveTransactions/>}
          />
          <Route path={'/receipt/'}
                 element={<OutputReceiptTransactions/>}
          />
          <Route path={'/completed/'}
                 element={<OutputCompletedTransactions/>}
          />
          <Route path={'/dispute/'}
                 element={<OutputDisputedTransactions/>}
          />
          <Route path={'/export/'}
                 element={<Export transactionsType={'output'}/>}
          />
        </Routes>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default BuyPage;
