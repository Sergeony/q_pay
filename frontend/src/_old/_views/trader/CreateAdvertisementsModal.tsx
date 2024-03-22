import React, {useMemo} from 'react';
import styled from 'styled-_components';
import {BackButton, Button} from "../../__UI/CommonUI";
import DropDown from "../../_components/common/DropDown";
import {useFormik} from 'formik';
import * as Yup from "yup";
import {BankIcons, CrossIcon} from "../../__UI/SVG";
import {useCreateAdMutation} from "../../../src/_service/adsService";
import {useFetchBanksQuery} from "../../../src/_service/banksService";
import {BankProps} from "../../../src/_store/reducers/banksSlice";
import {useFetchBankDetailsQuery} from "../../../src/_service/bankDetailsService";
import {BankDetailsProps} from "../../../src/_store/reducers/bankDetailsSlice";


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


interface IProps {
  onClose: () => void;
}

const CreateAdvertisementsModal = ({onClose}: IProps) => {
  const [createAdvertisement] = useCreateAdMutation();

  const formik = useFormik({
    initialValues: {
      bankDetailsId: NaN
    },
    validationSchema: Yup.object({
      bankDetailsId: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await createAdvertisement({
          bank_details_id: values.bankDetailsId
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

  const {data: bankDetails, error, isLoading} = useFetchBankDetailsQuery({});

  const bankDetailsOptions = useMemo(() => {
    return bankDetails?.map((r: BankDetailsProps) => ({ label: `${r.title} ${r.cardholder_name}`, value: r.id })) || [];
  }, [bankDetails]);

  const handleBankDetailsChange = (selectedOption: any) => {
    formik.setFieldValue('bankDetailsId', selectedOption.value);
  };


  return (
    <PopupOverlay>
      <PopupContainer>
        <CloseButton onClick={onClose}>
          <CrossIcon/>
        </CloseButton>
        <Title>Создание объявления</Title>
          <form onSubmit={formik.handleSubmit}>
            <DropDown label={'Выберите банк'}
                      width={'100%'}
                      value={undefined}
                      options={[...bankOptions]}
            />
            <DropDown label={"Выберете Реквизиты"}
                      width={'100%'}
                      options={[{label: "Реквизиты", value: ""}, ...bankDetailsOptions]}
                      value={bankDetailsOptions.find(o => o.value === formik.values.bankDetailsId)}
                      onChange={handleBankDetailsChange}
            />
            <Button style={{width: "400px", marginTop: "36px"}} type="submit">Создать</Button>
          </form>
          <BackButton style={{marginTop: "8px"}} onClick={onClose}>Отменить</BackButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default CreateAdvertisementsModal;
