import React, {useMemo} from "react";
import DateInput from "../../components/common/DateInput";
import styled from "styled-components";
import {Button} from "../../UI/CommonUI";
import DropDown from "../../components/common/DropDown";
import {useFetchBanksQuery} from "../../service/banksService";
import {BankProps} from "../../store/reducers/banksSlice";
import {BankIcons} from "../../UI/SVG";
import {useFetchBankDetailsQuery} from "../../service/bankDetailsService";
import {BankDetailsProps} from "../../store/reducers/bankDetailsSlice";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useLazyExportTransactionsQuery} from "../../service/exportService";


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


interface FormValues {
  bankId?: number;
  requisitesId?: number;
  from?: Date;
  to?: Date;
}


interface ExportProps {
  transactionsType: 'deposit' | 'withdrawal';
}

const Export = ({transactionsType}: ExportProps) => {
  const [exportInputTransactions] = useLazyExportTransactionsQuery();

  const formik = useFormik({
    initialValues: {
      bankId: undefined,
      requisitesId: undefined,
      from: undefined,
      to: undefined,
    },
    validationSchema: Yup.object({
      bankId: Yup.number(),
      requisitesId: Yup.number(),
      from: Yup.date(),
      to: Yup.date(),
    }),
    onSubmit: async (values: FormValues) => {
      try {
        await exportInputTransactions({
          transactionsType,
          bank: values.bankId,
          bank_details: values.requisitesId,
          from: values.from ? values.from.toISOString() : "",
          to: values.to ? values.to.toISOString() : "",
        }).unwrap();

      } catch (error) {
        console.error('Ошибка при загрузке файла:', error);
      }
    },
  });

  const {data: banks} = useFetchBanksQuery();
  const bankOptions = useMemo(() => {
    return banks?.map((o: BankProps) => ({ label: o.title, value: o.id, icon: BankIcons[o.id] })) || [];
  }, [banks]);
  const handleBankChange = (selectedOption: any) => {
    formik.setFieldValue('bankId', selectedOption.value);
  };

  const {data: requisites} = useFetchBankDetailsQuery({});
  const requisitesOptions = useMemo(() => {
    return requisites?.map((r: BankDetailsProps) => ({ label: `${r.title} ${r.cardholder_name}`, value: r.id })) || [];
  }, [requisites]);
  const handleRequisitesChange = (selectedOption: any) => {
    formik.setFieldValue('requisitesId', selectedOption.value);
  };

  const handleStatusChange = (selectedOption: any) => {
    // TODO: implement on server status parameter and add to here
  };

  return (
    <Wrapper>
      <form onSubmit={formik.handleSubmit}>
        <FilterLine>
          <DropDown width={'158px'}
                    options={[{label: "Статус", value: ""},
                      {label: "Завершенные", value: "completed"},
                      {label: "Споры", value: "disputed"},
                    ]}
                    value={{label: "Статус", value: ""}}
                    onChange={handleStatusChange}
          />
          <DropDown width={'158px'}
                    options={[{label: "Банк", value: ""}, ...bankOptions]}
                    value={bankOptions.find(o => o.value === formik.values.bankId)}
                    onChange={handleBankChange}
          />
          <DropDown width={'158px'}
                    options={[{label: "Реквизиты", value: ""}, ...requisitesOptions]}
                    value={requisitesOptions.find(o => o.value === formik.values.requisitesId)}
                    onChange={handleRequisitesChange}
          />
        </FilterLine>
        <DateTitle>Выберите временной промежуток для экспорта</DateTitle>
        <FilterLine>
          <DateInput placeholder={"От"}
                     value={formik.values.from}
                     onChange={(date) => formik.setFieldValue("from", date)}
          />
          <DateInput placeholder={"До"}
                     value={formik.values.to}
                     onChange={(date) => formik.setFieldValue("to", date)}
          />
        </FilterLine>
        <Button style={{width: "284px"}} type="submit">Export .xlsx</Button>
      </form>
    </Wrapper>
);
};

export default Export;
