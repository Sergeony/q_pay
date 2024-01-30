import React, {useState} from 'react';
import styled from "styled-components";
import {
  PageWrapper,
} from "../../UI/CommonUI";
import TraderHeader from "../../components/trader/TraderHeader";
import TabHeader from "../../components/common/TabHeader";
import {PlusIcon} from "../../UI/SVG";

import Advertisements from "../../views/trader/Advertisements";
import Requisites from "../../views/trader/Requisites";
import {NavLink, Route, Routes, useLocation} from "react-router-dom";
import CreateRequisitesModal from "../../views/trader/CreateRequisitesModal";
import CreateAdvertisementsModal from "../../views/trader/CreateAdvertisementsModal";


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 1500px;
    margin: 0 auto;
`;

const TabsWrapper = styled.div`
    margin-left: 152px;
    margin-right: 152px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 54px;
    margin-top: 78px;
`;

const Tabs = styled.nav`
    display: flex;
    gap: 20px;
`;

const Tab = styled(NavLink)<{ isActive: boolean }>`
    gap: 8px;
    font-family: 'Mulish', serif;
    font-size: 28px;
    font-weight: ${({isActive}) => (isActive ? "700" : "400")};
    line-height: 35px;
    letter-spacing: 0;
    text-align: left;
    color: ${({isActive}) => (isActive ? "#0F0021" : "#AFAAB6")};
    text-decoration: none;
`;

const PlusButton = styled.button`
    display: flex;
    border: none;
    background: none;
    padding: 0;
`;

const AdvertisementPage = () => {
  const location = useLocation();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <PageWrapper>
      <TraderHeader/>
      <TabHeader/>
      <ContentWrapper>
        <TabsWrapper>
          <Tabs>
            <Tab to={"/advertisements/"}
                 isActive={location.pathname.endsWith('/advertisements/')}
            >
              Объявления
            </Tab>
            <Tab to={"/advertisements/requisites/"}
                 isActive={location.pathname.endsWith('/requisites/')}
            >
              Реквизиты
            </Tab>
          </Tabs>
          <PlusButton onClick={() => {setModalIsOpen(true)}}>
          <PlusIcon/>
          </PlusButton>
        </TabsWrapper>
        <Routes>
          <Route path={'/'}
                 element={<Advertisements/>}
          />
          <Route path={'/requisites/'}
                 element={<Requisites/>}
          />
        </Routes>

        {
          modalIsOpen && location.pathname.endsWith('/requisites/') && <CreateRequisitesModal onClose={() => setModalIsOpen(false)}/>
        }
        {
          modalIsOpen && location.pathname.endsWith('/advertisements/') && <CreateAdvertisementsModal onClose={() => setModalIsOpen(false)}/>
        }
      </ContentWrapper>
    </PageWrapper>
  );
};

export default AdvertisementPage;
