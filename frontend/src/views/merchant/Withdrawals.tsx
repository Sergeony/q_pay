import {AwaitingIcon, SuccessIcon} from "../../UI/SVG";
import React from "react";
import styled from "styled-components";


const StyledTable = styled.table`
    border-collapse: separate;
    margin-top: 32px;
`;

const StyledTd = styled.td`
    display: flex;
    justify-content: center;
    align-items: center;

`;

const Bank = styled(StyledTd)`
    gap: 8px;
    width: 25%;
`;


const MyRate = styled(StyledTd)`
    width: 25%;
`;

const ExchangeRate = styled(StyledTd)`
    width: 25%;
`;


const Activity = styled(StyledTd)`
    width: 25%;
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
    width: 59.7vw;
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


const Withdrawals = () => {
  // const {data: advertisements, error, isLoading} = useFetchAdvertisementsQuery(params);

  const withdrawals = [
    {status: 2, amount: 173, id: 'DFhs-dfsldfj-sdfsdf', wallet: 'ASdHfdskjfoiDFhiuosd', ts: 1697622010000},
    {status: 1, amount: 173, id: 'DFhs-dfsldfj-sdfsdf', wallet: 'ASdHfdskjfoiDFhiuosd', ts: 1697622020000},
    {status: 3, amount: 173, id: 'DFhs-dfsldfj-sdfsdf', wallet: 'ASdHfdskjfoiDFhiuosd', ts: 1697622020000},
  ]

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error</div>;

  return (
      <StyledTable>
        <thead>
        <Tr>
          <HeadRow>
            <Bank>Сумма</Bank>
            <MyRate>ID Транзакции</MyRate>
            <ExchangeRate>Кошелек</ExchangeRate>
            <Activity>Дата и время</Activity>
          </HeadRow>
        </Tr>
        </thead>
        <tbody>
        {withdrawals?.map((w, index) => {
          const Status = w.status == 1 ? AwaitingIcon : SuccessIcon;
          return (
            <BodyTr key={index}>
              <StyledRow>
                <Bank>
                  <RateWrapper>
                    <FirstLine style={{display: "flex", alignItems: 'center', gap: '8px'}}><Status size={16}/> {w.amount}</FirstLine>
                  </RateWrapper>
                </Bank>
                <MyRate>
                  <RateWrapper>
                    <FirstLine>{w.id}</FirstLine>
                  </RateWrapper>
                </MyRate>
                <ExchangeRate>
                  <RateWrapper>
                    <FirstLine>{w.wallet}</FirstLine>
                  </RateWrapper>
                </ExchangeRate>
                <Activity>
                  <RateWrapper>
                    <FirstLine>{new Date(w.ts).getDate()}.{new Date(w.ts).getMonth()+1}.{new Date(w.ts).getFullYear()}</FirstLine>
                    <SecondLine>{`${new Date(w.ts).getHours()}:${new Date(w.ts).getMinutes()}`}</SecondLine>
                  </RateWrapper>
                </Activity>
              </StyledRow>
            </BodyTr>
          )
        })}
        </tbody>
      </StyledTable>
  );
};

export default Withdrawals;
