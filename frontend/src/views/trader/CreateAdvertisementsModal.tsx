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
      requisitesId: 3
    },
    validationSchema: Yup.object({
      requisitesId: Yup.number().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        await createAdvertisement({
          requisites_id: values.requisitesId
        });

      } catch (error) {
        console.error('Ошибка авторизации:', error);
      }
    },
  });

  const {data: banks} = useFetchBanksQuery();

  const bankOptions = useMemo(() => {
    return banks?.map((o: BankProps) => ({ label: o.title, value: o.id, icon: BankIcons[o.id] })) || [];
  }, [banks]);

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
                      options={[{label: "Банк", value: "", isPlaceholder: true}, ...bankOptions]}
            />
            <DropDown label={"Выберете Реквизиты"}
                      width={'100%'}
                      options={[
                        {label: "Реквизиты", value: "", isPlaceholder: true},
                        {label: "*1234 матвиенко С.", value: 1},
                        {label: "*1234 Соболенко С.", value: 1},
                        {label: "*1234 Савченко С.", value: 1},
                      ]}
            />
            <Button style={{width: "400px", marginTop: "16px"}} type="submit">Создать</Button>
          </form>
          <BackButton style={{marginTop: "8px"}} onClick={onClose}>Отменить</BackButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default CreateAdvertisementsModal;
