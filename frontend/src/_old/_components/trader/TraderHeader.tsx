import React from 'react';
import styled from 'styled-_components';
import {NotificationBellIcon, SnowFlakeIcon, TetherIcon} from "../../__UI/SVG";
import {NavLink} from "react-router-dom";
import Header from '../common/Header';
import {RootState} from "../../_store/_store";
import {useSelector} from "react-redux";
import {TransactionType} from "_service/transactionsService";


const NavUl = styled.ul`
    display: flex;
    gap: 20px;
    margin-left: 50px;
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


const Circle = styled.span`
    border-radius: 50%;
    height: 16px;
    width: 16px;
    text-align: center;
    font-family: 'Mulish', serif;
    font-size: 12px;
    background-color: #9E68F7;
    color: #FDFFF9;
    position: absolute;
    right: 0;
    top: -10px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const TraderHeader = () => {
  const transactions = useSelector((state: RootState) => state.webSocket.transactions);
  const balance = useSelector((state: RootState) => state.balance.balance);

  const depositTransactionsCount = transactions.filter(t => t.type == TransactionType.DEPOSIT);
  const withdrawalTransactionsCount = transactions.filter(t => t.type == TransactionType.WITHDRAWAL);

  return (
    <Header>
      <nav>
        <NavUl>
          <li>
            <TabLink to={"/advertisements/"}
                     isActive={location.pathname.includes('/advertisements/')}
            >Объявления</TabLink>
          </li>
          <li style={{position: 'relative'}}>
            {depositTransactionsCount.length > 0 && (
              <Circle>{depositTransactionsCount.length}</Circle>
            )}
            <TabLink to={"/sell/active/"}
                     isActive={location.pathname.includes('/sell/')}
            >Продажа</TabLink>
          </li>
          <li style={{position: 'relative'}}>
            {withdrawalTransactionsCount.length > 0 && (
              <Circle>{withdrawalTransactionsCount.length}</Circle>
            )}
            <TabLink to={"/buy/active/"}
                     isActive={location.pathname.includes('/buy/')}
            >Покупка</TabLink>
          </li>
          <li style={{width: "284px"}}>
          <TabLink to={"/logs/"}
                     isActive={location.pathname.includes('/logs/')}
            >Логи уведомлений по АЗ</TabLink>
          </li>
          <li>
            <TabLink to={"/settings/"}
                     isActive={location.pathname.includes('/settings/')}
            >Настройки</TabLink>
          </li>
          <li>
            <TabLink to={"/balance/"}
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

export default TraderHeader;
