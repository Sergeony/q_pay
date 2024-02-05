import React, {useMemo} from 'react';
import styled from 'styled-components';
import {BackButton, Button} from "../../UI/CommonUI";
import DropDown from "../../components/common/DropDown";
import {useFormik} from 'formik';
import * as Yup from "yup";
import {BankIcons, CrossIcon} from "../../UI/SVG";
import {useCreateAdvertisementMutation} from "../../service/advertisementsService";
import {useFetchBanksQuery} from "../../service/banksService";
import {BankProps} from "../../store/reducers/banksSlice";
import {useFetchRequisitesQuery} from "../../service/requisitesService";
import {RequisitesProps} from "../../store/reducers/requisitesSlice";


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
  const [createAdvertisement] = useCreateAdvertisementMutation();

  const formik = useFormik({
    initialValues: {
      requisitesId: NaN
    },
    validationSchema: Yup.object({
      requisitesId: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await createAdvertisement({
          requisites_id: values.requisitesId
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

  const {data: requisites, error, isLoading} = useFetchRequisitesQuery({});

  const requisitesOptions = useMemo(() => {
    return requisites?.map((r: RequisitesProps) => ({ label: `${r.title} ${r.cardholder_name}`, value: r.id })) || [];
  }, [requisites]);

  const handleRequisitesChange = (selectedOption: any) => {
    formik.setFieldValue('requisitesId', selectedOption.value);
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
                      value={{label: "Банк", value: ""}}
                      options={[{label: "Банк", value: ""}, ...bankOptions]}
            />
            <DropDown label={"Выберете Реквизиты"}
                      width={'100%'}
                      options={[{label: "Реквизиты", value: ""}, ...requisitesOptions]}
                      value={requisitesOptions.find(o => o.value === formik.values.requisitesId)}
                      onChange={handleRequisitesChange}
            />
            <Button style={{width: "400px", marginTop: "16px"}} type="submit">Создать</Button>
          </form>
          <BackButton style={{marginTop: "8px"}} onClick={onClose}>Отменить</BackButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default CreateAdvertisementsModal;
