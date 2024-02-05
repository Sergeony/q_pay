import React from 'react';
import styled from "styled-components";
import {
  PageWrapper,
} from "../../UI/CommonUI";
import TabHeader from "../../components/common/TabHeader";
import {NavLink, Route, Routes, useLocation, useParams} from "react-router-dom";
import InputCompletedTransactions from "../../views/merchant/InputCompletedTransactions";
import OutputCompletedTransactions from '../../views/merchant/OutputCompletedTransactions';
import Switch from "../../components/common/Switch";
import KebabMenu from "../../components/common/KebabMenu";
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import AdminHeader from '../../components/admin/AdminHeader';

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

const SwitchAndKebabWrapper = styled.div`
    grid-column: 9;
    display: flex;
`;


const MerchantStatsPage = () => {
  const { email, userId } = useSelector((state: RootState) => state.admin);

  if (!userId)
    return (<div>No merchant were specified</div>)

  return (
    <PageWrapper>
      <AdminHeader/>
      <TabHeader/>
      <ContentWrapper>
        <TitleWrapper>
        <Title>{email}</Title>
          <SwitchAndKebabWrapper>
            <Switch size={'large'}
                    isActivated={true}
                    onToggle={() => {return}}
            />
            <KebabMenu showEdit={false}
                       showDelete={true}
                       onEdit={() => {return}}
                       onDelete={() => {return}}
            />
          </SwitchAndKebabWrapper>
        </TitleWrapper>

        <StyledNav>
          <TabLink to={`/merchants/${userId}/deposit/`}
                   className={({isActive}) => isActive ? 'active' : ''} 
          >Пополнение</TabLink>
          <TabLink to={`/merchants/${userId}/withrawal/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Вывод</TabLink>
          <TabLink to={`/merchants/${userId}/settings/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Настройки</TabLink>
          <TabLink to={`/merchants/${userId}/stats/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Статистика</TabLink>
        </StyledNav>

        <Routes>
          <Route path={'/deposit/'}
                 element={<InputCompletedTransactions merchantId={userId}/>}
          />
          <Route path={'/withrawal/'}
                 element={<OutputCompletedTransactions merchantId={userId}/>}
          />
        </Routes>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MerchantStatsPage;
