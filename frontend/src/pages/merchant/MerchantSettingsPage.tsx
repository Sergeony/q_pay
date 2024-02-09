import React from 'react';
import styled from "styled-components";
import {
  PageWrapper,
} from "../../UI/CommonUI";
import {NavLink, Route, Routes, useLocation} from "react-router-dom";
import General from "../../views/merchant/General";
import Integration from "../../views/merchant/Integration";
import MerchantHeader from "../../components/merchant/MerchantHeader";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 1500px;
    margin: 0 auto;
`;

const Tabs = styled.nav`
    display: flex;
    gap: 40px;
    margin: 32px 0 0 152px;
`;

const Tab = styled(NavLink)<{ isActive: boolean }>`
    gap: 8px;
    font-family: 'Helvetica', serif;
    font-size: 18px;
    font-weight: ${({isActive}) => (isActive ? "700" : "400")};
    line-height: normal;
    letter-spacing: 0;
    text-align: left;
    color: ${({isActive}) => (isActive ? "#0F0021" : "#6B48A4")};
    text-decoration: none;
    font-style: normal;
`;

const PageTitle = styled.h1`
    color: #0F0021;

    font-family: 'Mulish', serif;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;

    margin-left: 152px;
    margin-top: 128px;
`;

const AdvertisementPage = () => {
  const location = useLocation();

  return (
    <PageWrapper>
      <MerchantHeader/>
      <ContentWrapper>
        <PageTitle>Настройки</PageTitle>
          <Tabs>
            <Tab to="/m/settings/"
                 isActive={location.pathname.endsWith('/settings/')}
            >
              Основные
            </Tab>
            <Tab to="/m/settings/integration/"
                 isActive={location.pathname.includes('/integration/')}
            >
              Интеграция
            </Tab>
          </Tabs>

        <Routes>
          <Route path={'/'}
                 element={<General/>}
          />
          <Route path={'/integration/'}
                 element={<Integration/>}
          />
        </Routes>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AdvertisementPage;
