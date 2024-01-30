import pumb from "../../assets/img/pumb.png";
import privat from "../../assets/img/privat.png";
import {AutomationIcon, TetherIcon} from "../../UI/SVG";
import React from "react";
import styled from "styled-components";
import {Button} from "../../UI/CommonUI";


const StyledTable = styled.table`
    border-collapse: separate;
    margin-top: 32px;
    width: 100%;
`;

const StyledTd = styled.td`
    display: flex;
    justify-content: center;
    align-items: center;

`;

const Bank = styled(StyledTd)`
    gap: 8px;
    width: 129px;
    justify-content: start;
`;

const TranIDTitle = styled.span`
    width: 100%;
    text-align: start;
    margin-left: 9.77%;

`;

const TranID = styled(StyledTd)`
    width: 29.17%;

    @media (max-width: 1752px) {
        & > :first-child {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        & {
            margin: 0 20px;
        }
    }
`;

const MyRate = styled(StyledTd)`
    width: 5.78%;
`;

const ExchangeRate = styled(StyledTd)`
    width: 9.84%;
`;


const Client = styled(StyledTd)`
    width: 4.78%;
`;

const Reqs = styled(StyledTd)`
    width: 12.83%;
`;

const Start = styled(StyledTd)`
    width: 7.7%;
`;

const End = styled(StyledTd)`
    width: 5.99%;
`;

const Status = styled(StyledTd)`
    width: 144px;
    gap: 8px;
    justify-content: start;
    margin-left: 4.42%;

`;

const StatusTitle = styled.span`
    width: 100%;
    margin-left: 32px;
`;

const Tr = styled.tr`
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 24px;
    align-items: center;
`;

const BodyTr = styled(Tr)`
    border-radius: 16px;
    background: radial-gradient(101.5% 101.5% at 50% 50%, rgba(254, 254, 254, 0.45) 0%, rgba(225, 227, 221, 0.43) 44.79%, rgba(116, 125, 97, 0.36) 100%);
    padding: 24px;
`;

const StyledRow = styled.div`
    width: 73vw;
    display: flex;

    color: #0F0021;
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    @media (max-width: 1500px) {
        font-size: 14px;
    }
`;

const HeadRow = styled(StyledRow)`
    justify-content: space-evenly;

    color: #46404B;
    text-align: center;

    font-family: 'Mulish', serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    @media (max-width: 1500px) {
        font-size: 12px;
    }
    @media (max-width: 1296px) {
        font-size: 10px;
    }
`;

const Value = styled.div`
    display: flex;
    gap: 28px;
    justify-content: end;
    align-items: center;
`;

const UAHValue = styled(Value)`
    margin-bottom: 8px;
    gap: 16px;

`;

const RateWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
`;

const FirstLine = styled.span`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const SecondLine = styled.span`
    color: #46404B;
    text-align: center;

    font-family: 'Mulish', serif;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    @media (max-width: 1500px) {
        font-size: 8px;
    }
    @media (max-width: 1196px) {
        font-size: 6px;
    }
`;

const Values = styled.div`
`;

const BankIconWrapper = styled.div`
    display: flex;
    padding: 1px;
`;


const StatusText = styled.span`
    display: block;
    background: linear-gradient(135deg, #3F9AEF 31.21%, #7BFFE7 121.47%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
`;

const InputDisputedTransactions = () => {

  return (
      <StyledTable>
        <thead>
        <Tr>
          <HeadRow>
            <Bank></Bank>
            <TranID><TranIDTitle>ID Сделки</TranIDTitle></TranID>
            <MyRate>Мой курс</MyRate>
            <ExchangeRate>Курс биржи</ExchangeRate>
            <Client>Клиент</Client>
            <Reqs>Мои реквизиты</Reqs>
            <Start>Создана</Start>
            <End>Закрыта</End>
            <Status><StatusTitle>Статус</StatusTitle></Status>
          </HeadRow>
        </Tr>
        </thead>
        <tbody>
        <BodyTr>
          <StyledRow>
            <Bank>
              <img src={pumb} alt={"Bank"} width={32} height={32}/>
              <Values>
                <UAHValue>
                  <BankIconWrapper>
                    <img src={privat} alt={"Bank"} width={22} height={22}/>
                  </BankIconWrapper>
                  <span>1942₴</span>
                </UAHValue>
                <Value>
                  <TetherIcon/>
                  <SecondLine>48,86₮</SecondLine>
                </Value>
              </Values>
            </Bank>
            <TranID><span>d491d727-02b6-40f2-9dd3-144297526c24</span></TranID>
            <MyRate>
              <RateWrapper>
                <FirstLine>38,74₴</FirstLine>
                <SecondLine>3,75%</SecondLine>
              </RateWrapper>
            </MyRate>
            <ExchangeRate>
              <RateWrapper>
                <FirstLine>38,74₴</FirstLine>
                <SecondLine>BINANCE</SecondLine>
              </RateWrapper>
            </ExchangeRate>
            <Client>
              <RateWrapper>
                <FirstLine>9999</FirstLine>
                <SecondLine>0 l 0₮</SecondLine>
              </RateWrapper>
            </Client>
            <Reqs>
              <RateWrapper>
                <FirstLine>Туда 1234</FirstLine>
                <SecondLine>Соболенко С.</SecondLine>
              </RateWrapper>
            </Reqs>
            <Start>
              <RateWrapper>
                <FirstLine>01:56</FirstLine>
                <SecondLine>12.31.2024</SecondLine>
              </RateWrapper>
            </Start>
            <End>
              <RateWrapper>
                <FirstLine>-</FirstLine>
              </RateWrapper>
            </End>
            <Status>
              <AutomationIcon height={"24px"} width={"24px"} useGradient={true}/>
              <StatusText>Автозакрытие</StatusText>
            </Status>
          </StyledRow>
        </BodyTr>
        </tbody>
      </StyledTable>
  );
};

export default InputDisputedTransactions;
