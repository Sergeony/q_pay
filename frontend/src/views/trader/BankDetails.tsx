import {BankIcons, CrossIcon} from "../../UI/SVG";
import React from "react";
import styled from "styled-components";
import Switch from "../../components/common/Switch";
import {
  useDeleteBankDetailsMutation,
  useFetchBankDetailsQuery,
  useUpdateBankDetailsMutation
} from "../../service/bankDetailsService";
import KebabMenu from "../../components/common/KebabMenu";


const StyledTable = styled.table`
    border-collapse: separate;
    margin-top: 32px;
    
    margin-left: 152px;
`;

const StyledTd = styled.td`
    display: flex;
    justify-content: center;
    align-items: center;

`;

const Bank = styled(StyledTd)`
    gap: 8px;
    width: 17.5%;
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
    width: 25%;
`;

const ExchangeRate = styled(StyledTd)`
    width: 25%;
`;


const Activity = styled(StyledTd)`
    width: 25%;
`;

const Menu = styled(StyledTd)`
    width: 7.5%;
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

interface RequisitesViewProps {
  traderId?: number;
}

const BankDetails = ({traderId}: RequisitesViewProps) => {
  const params = traderId ? {user_id: traderId} : {};
  const {data: bankDetails, error, isLoading} = useFetchBankDetailsQuery(params);
  const [deleteRequisites] = useDeleteBankDetailsMutation();

  const handleDelete = (id: number) => {
    deleteRequisites(id)
      .unwrap()
      .then(() => {
        console.log("Реквизиты удалены");
      })
      .catch((error) => {
        console.error("Ошибка при удалении реквизитов:", error);
      });
  };

  const [toggleActivity] = useUpdateBankDetailsMutation();

  const handleToggle = (id: number, isActive: boolean) => {
    toggleActivity({ id, is_active: isActive });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
      <StyledTable>
        <thead>
        <Tr>
          <HeadRow>
            <TranID><TranIDTitle>Банк</TranIDTitle></TranID>
            <MyRate>Название</MyRate>
            <ExchangeRate>Данные карты</ExchangeRate>
            <Activity>Активность</Activity>
            <Activity></Activity>
          </HeadRow>
        </Tr>
        </thead>
        <tbody>
        {bankDetails?.map((bd, index) => {
          const BankIcon = BankIcons[bd.bank.id] || <CrossIcon/>;
          return (
            <BodyTr key={index}>
              <StyledRow>
                <Bank>
                  <Values>
                    <UAHValue>
                      <BankIconWrapper>
                        <BankIcon size={22}/>
                      </BankIconWrapper>
                      <span>{bd.bank.title} UAH</span>
                    </UAHValue>
                  </Values>
                </Bank>
                <MyRate>
                  <RateWrapper>
                    <FirstLine>{bd.title}</FirstLine>
                  </RateWrapper>
                </MyRate>
                <ExchangeRate>
                  <RateWrapper>
                    <FirstLine>{bd.card_number}</FirstLine>
                    <SecondLine>{bd.cardholder_name}</SecondLine>
                  </RateWrapper>
                </ExchangeRate>
                <Activity>
                  <Switch size={'small'}
                          isActivated={bd.is_active}
                          onToggle={() => handleToggle(bd.id, !bd.is_active)}
                  />
                </Activity>
                <Menu>
                  <KebabMenu showDelete={true}
                             showEdit={true}
                             onEdit={() => {alert("EDITING...")}}
                             onDelete={() => handleDelete(bd.id)}
                  />
                </Menu>
              </StyledRow>
            </BodyTr>
          )
        })}
        </tbody>
      </StyledTable>
  );
};

export default BankDetails;
