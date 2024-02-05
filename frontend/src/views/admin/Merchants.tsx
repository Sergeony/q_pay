import React from "react";
import styled from "styled-components";
import Switch from "../../components/common/Switch";
import KebabMenu from "../../components/common/KebabMenu";
import {useDeleteMerchantMutation, useFetchMerchantsQuery, useUpdateMerchantMutation} from "../../service/adminService";
import {useNavigate} from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../store/reducers/adminSlice";


const StyledTable = styled.table`
    border-collapse: separate;
    margin-top: 32px;
`;

const StyledTd = styled.td`
    display: flex;
    justify-content: center;
    align-items: center;

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


const Merchants = () => {
  const {data: merchants, error, isLoading} = useFetchMerchantsQuery();
  const [deleteMerchant] = useDeleteMerchantMutation();
  const [toggleActivity] = useUpdateMerchantMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = (id: number) => {
    deleteMerchant({
      id
    })
      .unwrap()
      .then(() => {
        console.log("Трейдер удален");
      })
      .catch((error) => {
        console.error("Ошибка при удалении трейдера:", error);
      });
  };

  const handleToggle = (id: number, isActivated: boolean) => {
    toggleActivity({
      id,
      is_activated: isActivated
    })
      .unwrap()
      .catch((error) => {
        console.error("Ошибка при обновлении трейдера:", error);
      })
  };

  const handleClick = (userId: number, email: string) => {
    dispatch(setUserData({ userId, email }));
    navigate(`/merchants/${userId}/`);
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
      <StyledTable>
        <thead>
        <Tr>
          <HeadRow>
            <TranID>Логин</TranID>
            <MyRate>ID Мерчанта</MyRate>
            <ExchangeRate>Сделок</ExchangeRate>
            <Activity>Баланс</Activity>
            <Activity>Активность</Activity>
          </HeadRow>
        </Tr>
        </thead>
        <tbody>
        {merchants?.map((t, index: number) => {
          return (
            <BodyTr key={index} onClick={() => handleClick(t.id, t.email)}>
              <StyledRow>
                <TranID><span>{t.email}</span></TranID>
                <TranID><span>{t.id}</span></TranID>
                <TranID><span>{t.total_transactions}</span></TranID>
                <TranID><span>{t.balance} ₮</span></TranID>
                <Activity>
                  <Switch size={'small'}
                          isActivated={t.is_activated}
                          onToggle={() => handleToggle(t.id, !t.is_activated)}/>
                </Activity>
                <Menu>
                  <KebabMenu showDelete={true}
                             showEdit={false}
                             onEdit={() => {return}}
                             onDelete={() => handleDelete(t.id)}
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

export default Merchants;
