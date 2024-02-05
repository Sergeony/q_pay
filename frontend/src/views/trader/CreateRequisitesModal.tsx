import React, {useMemo} from 'react';
import styled from 'styled-components';
import {BackButton, Button, StyledField} from "../../UI/CommonUI";
import DropDown from "../../components/common/DropDown";
import {useFormik} from 'formik';
import * as Yup from "yup";
import {BankIcons, CrossIcon} from "../../UI/SVG";
import {useFetchBanksQuery} from "../../service/banksService";
import {BankProps} from "../../store/reducers/banksSlice";
import {useCreateRequisiteMutation} from "../../service/requisitesService";


const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(69, 69, 69, 0.60);
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PopupContainer = styled.div`
    background: #F8F5FE;
    padding: 40px;
    width: 480px; // Установите подходящую ширину
    box-shadow: -3px -3px 9px 0 rgba(0, 0, 0, 0.10);
    border: 1px solid #46404B;
    border-radius: 16px;
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    
    padding: 0;
    background: none;
    border: none;
`;

const Title = styled.h2`
    text-align: center;

    color: #46404B;
    font-family: 'Helvetica', serif;
    font-size: 22px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const FormField = styled.div`
    margin-bottom: 16px;

    display: flex;
    padding: 8px 16px;
    align-items: center;
    gap: 8px;
    width: 100%;

    border-radius: 8px;
    border: 1px solid #46404B;
`;


interface IProps {
  onClose: () => void;
}

const CreateRequisitesModal = ({onClose}: IProps) => {
  const [createRequisites] = useCreateRequisiteMutation();

  const formik = useFormik({
    initialValues: {
      bankId: NaN,
      cardNumber: '',
      name: "",
      title: "",
    },
    validationSchema: Yup.object({
      bankId: Yup.number(),
      cardNumber: Yup.number(),
      name: Yup.string(),
      title: Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        await createRequisites({
          bank_id: values.bankId,
          title: values.title,
          card_number: values.cardNumber,
          cardholder_name: values.name
        });

        onClose();

      } catch (error) {
        console.error('Ошибка авторизации:', error);
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

  return (
    <PopupOverlay>
      <PopupContainer>
        <CloseButton onClick={onClose}>
          <CrossIcon/>
        </CloseButton>
        <Title>Создание объявления</Title>
        <form onSubmit={formik.handleSubmit}>
         {/*TODO: move it to extranl styles */}
        <div style={{marginBottom: "16px", display: "flex"}}>
          <DropDown label={'Выберите банк'}
                    width={'100%'}
                    options={[{ label: "Банк", value: ""}, ...bankOptions]}
                    onChange={handleBankChange}
                    value={bankOptions.find(o => o.value === formik.values.bankId)}
          />
          </div>
          <label>Номер карты</label>
          <FormField>
            <StyledField name="cardNumber"
                         type="text"
                         onChange={formik.handleChange}
                         value={formik.values.cardNumber}
            />
          </FormField>

          <label>Фамилия и Имя</label>
          <FormField>
            <StyledField name="name"
                         type="text"
                         onChange={formik.handleChange}
                         value={formik.values.name}
            />
          </FormField>

          <label>Название Реквизитов</label>
          <FormField>
            <StyledField name="title"
                         type="text"
                         onChange={formik.handleChange}
                         value={formik.values.title}
            />
          </FormField>
          <Button style={{width: "400px", marginTop: "16px"}} type="submit">Создать</Button>
        </form>
        <BackButton style={{marginTop: "8px"}} onClick={onClose}>Отменить</BackButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default CreateRequisitesModal;
