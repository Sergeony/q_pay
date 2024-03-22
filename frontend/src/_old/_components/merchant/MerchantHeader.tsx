import React from 'react';
import styled from 'styled-_components';
import {NotificationBellIcon, SnowFlakeIcon, TetherIcon} from "../../__UI/SVG";
import {NavLink} from "react-router-dom";
import Header from '../common/Header';
import {useSelector} from "react-redux";
import {RootState} from "../../_store/_store";
import {TransactionType} from "_service/transactionsService";


const NavUl = styled.ul`
    display: flex;
    gap: 20px;
    margin-left: 202px;
    align-items: center;
`;

const TabLink = styled(NavLink)<{ isActive: boolean }>`
    text-decoration: none;
    padding: 8px;
    width: 132px;

    font-family: "Mulish", serif;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0;
    text-align: left;

    color: ${({isActive}) => (isActive ? "#0F0021" : ({theme}) => theme.header_nav_link_text_color)};
    font-weight: ${({isActive}) => (isActive ? 700 : 400)};
`;

const BalancesWrapper = styled.div`
    padding: 8px;
    min-width: 132px;
    border: 1px solid;
    border-color: ${({theme}) => theme.balance_wrapper_border_color};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    margin-right: 20px;
`;

const BalancesContainer = styled.div`
    text-align: right;
`;

const ActiveBalance = styled.span`
    display: flex;
    align-items: center;
    color: ${({theme}) => theme.active_balance_text_color};
`;

const FrozenBalance = styled.span`
    display: flex;
    align-items: center;
    background: ${({theme}) => theme.frozen_balance_text_color};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const NotificationBell = styled(NotificationBellIcon)`
    fill: ${({theme}) => theme.notification_bell_fill_color};
    margin-right: 4px;
`;


const MerchantHeader = () => {
  const balance = useSelector((state: RootState) => state.balance.balance);

  return (
    <Header>
      <nav>
        <NavUl>
          <li>
            <TabLink to={"/deposit/awaiting-processing/"}
                     isActive={location.pathname.includes('/deposit/')}
            >Пополнение</TabLink>
          </li>
          <li>
            <TabLink to={"/withdrawal/awaiting-processing/"}
                     isActive={location.pathname.includes('/withdrawal/')}
            >Вывод</TabLink>
          </li>
          <li style={{width: "284px"}}>
            <TabLink to={"/logs/"}
                     isActive={location.pathname.includes('/logs/')}
            >Логи уведомлений по АЗ</TabLink>
          </li>
          <li>
            <TabLink to={"/m/settings/"}
                     isActive={location.pathname.includes('/m/settings/')}
            >Настройки</TabLink>
          </li>
          <li>
            <TabLink to={"/m/balance/"}
                     isActive={location.pathname.includes('/balance/')}
            >
              <BalancesWrapper>
                <BalancesContainer>
                  <ActiveBalance>{balance.activeBalance}<TetherIcon/></ActiveBalance>
                  <FrozenBalance>{balance.frozenBalance}<SnowFlakeIcon/></FrozenBalance>
                </BalancesContainer>
              </BalancesWrapper>
            </TabLink>
          </li>
        </NavUl>
      </nav>

      <NotificationBell/>
    </Header>
  );
};

export default MerchantHeader;
