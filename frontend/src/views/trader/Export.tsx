import React from "react";
import Select from "../../components/common/DropDown";
import DateInput from "../../components/common/DateInput";
import styled from "styled-components";
import {Button} from "../../UI/CommonUI";


const FilterLine = styled.div`
    display: flex;
    gap: 20px;
    margin: 16px 0;
`;

const DateTitle = styled.span`
    color: #46404B;

    font-family: 'Helvetica', serif;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    
    display: inline-block;
    margin: 16px 0 8px;
`;

const Wrapper = styled.div`
    display: inline-block;
    margin-top: 16px;
    margin-left: 152px;
`;

const InputActiveTransactions = () => {
  return (
    <Wrapper>
      <FilterLine>
        <Select width={'158px'}
                value={{label: "Категория", value: ""}}
                options={[
          {label: "Категория", value: ""},
          {label: "Завершенные", value: "completed"},
          {label: "Споры", value: "disputed"},
        ]}/>
        <Select width={'158px'}
                value={{label: "Банк", value: ""}}
                options={[
          {label: "Банк", value: ""},
          {label: "ПриватБанк", value: "privat"},
          {label: "МоноБанк", value: "mono"},
          {label: "ОщадБанк", value: "oshchad"},
          {label: "УкрГазБанк", value: "urk_gaz"},
          {label: "Райффайзен Банк", value: "raiffeisen"},
          {label: "УкрСибБанк", value: "ukr_sib"},
          {label: "Пумб", value: "pumb"},
          {label: "А Банк", value: "a"},
        ]}/>
        <Select width={'158px'}
                value={{label: "Реквизиты", value: ""}}
                options={[
          {label: "Реквизиты", value: ""},
          {label: "*1234 матвиенко С.", value: 1},
          {label: "*1234 Соболенко С.", value: 1},
          {label: "*1234 Савченко С.", value: 1},
        ]}/>
      </FilterLine>
      <DateTitle>Выберите временной промежуток для экспорта</DateTitle>
      <FilterLine>
        <DateInput placeholder={"От"}/>
        <DateInput placeholder={"До"}/>
      </FilterLine>
      <Button style={{width: "284px"}}>Export .xlsx</Button>
    </Wrapper>
  );
};

export default InputActiveTransactions;
