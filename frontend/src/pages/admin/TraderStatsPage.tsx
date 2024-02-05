import React from 'react';
import styled from "styled-components";
import {
  PageWrapper,
} from "../../UI/CommonUI";
import TabHeader from "../../components/common/TabHeader";
import {NavLink, Route, Routes} from "react-router-dom";
import InputCompletedTransactions from "../../views/trader/InputCompletedTransactions";
import Switch from "../../components/common/Switch";
import KebabMenu from "../../components/common/KebabMenu";
import Advertisements from '../../views/trader/Advertisements';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import Requisites from '../../views/trader/Requisites';
import OutputCompletedTransactions from '../../views/trader/OutputCompletedTransactions';
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


const TraderStatsPage = () => {
  const { email, userId } = useSelector((state: RootState) => state.admin);

  if (!userId)
    return (<div>No trader were specified</div>)

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
          <TabLink to={`/traders/${userId}/sell/`}
                   className={({isActive}) => isActive ? 'active' : ''} 
          >Продажа</TabLink>
          <TabLink to={`/traders/${userId}/buy/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Покупка</TabLink>
          <TabLink to={`/traders/${userId}/advertisements/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Объявления</TabLink>
          <TabLink to={`/traders/${userId}/requisites/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Реквизиты</TabLink>
          <TabLink to={`/traders/${userId}/settings/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Настройки</TabLink>
          <TabLink to={`/traders/${userId}/stats/`}
                   className={({isActive}) => isActive ? 'active' : ''}
          >Статистика</TabLink>
        </StyledNav>

        <Routes>
          <Route path={'/sell/'}
                 element={<InputCompletedTransactions traderId={userId}/>}
          />
          <Route path={'/buy/'}
                 element={<OutputCompletedTransactions traderId={userId}/>}
          />
          <Route path={`/advertisements/`}
                 element={<Advertisements traderId={userId}/>}
          />
          <Route path={'/requisites/'}
                 element={<Requisites traderId={userId}/>}
          />
        </Routes>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default TraderStatsPage;
