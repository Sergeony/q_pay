import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: grid;
    grid-template-columns: 1fr 436px 1fr;
    margin-top: 97px;

    & > :nth-child(3) {
        grid-column: 2 / 3;
    }
`;

const MasterDiv = styled.div`
    display: flex;
    gap: 5px;
`;


const Div1 = styled.div`
    display: flex;
    flex-grow: 2.5;
    background-color: chartreuse;
`;


const Div2 = styled.div`
    display: flex;
    flex-grow: 2;
    background-color: coral;
`;


const Div3 = styled.div`
    display: flex;
    flex-grow: 2;
    background-color: darkseagreen;
`;


const Div4 = styled.div`
    display: flex;
    flex-grow: 1.2;
    background-color: mediumslateblue;
`;


const StyledTd = styled.td`
  display: flex;
  justify-content: center;
    background-color: #61dafb;
`;

const TranID = styled(StyledTd)`
    width: 29.17%;
`;

const ExchangeRate = styled(StyledTd)`
    width: 5.78%;
`;

const MyRate = styled(StyledTd)`
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

const Tr = styled.tr`
    width: 73vw;
    display: flex;
    gap: 5px;
`;

const MyPage = () => {

  return (
    <Container>


      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID Сделки</th>
            <th>Курс биржи</th>
            <th>Мой курс</th>
            <th>Клиент</th>
            <th>Мои реквизиты</th>
            <th>Создана</th>
            <th>Закрыта</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          <Tr>
            <td>ываываыа</td>
            <TranID>2342-2342-2432-2342</TranID>
            <ExchangeRate>34.34в</ExchangeRate>
            <MyRate>45.34в</MyRate>
            <Client>4555</Client>
            <Reqs>Соболенко С.</Reqs>
            <Start>34:45</Start>
            <End>34:34</End>
            <td>Автозакрытие</td>
          </Tr>
        </tbody>
      </table>
    </Container>
  );
};

export default MyPage;
