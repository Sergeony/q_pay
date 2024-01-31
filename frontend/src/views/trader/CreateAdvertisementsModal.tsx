import React, {useState} from 'react';
import styled from 'styled-components';
import {BackButton, Button, StyledField} from "../../UI/CommonUI";
import DropDown from "../../components/common/DropDown";
import Select from "../../components/common/DropDown";
import {Form, Formik, useFormik} from 'formik';
import * as Yup from "yup";
import {CrossIcon} from "../../UI/SVG";
import {useLoginUserMutation} from "../../service/authService";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {useCreateAdvertisementMutation} from "../../service/advertisementsService";
import {Simulate} from "react-dom/test-utils";
import submit = Simulate.submit;

const RegistrationSchema = Yup.object().shape({
  bank: Yup.string().required('Required'),
  reqs: Yup.string().min(8, '').required('Required'),
});


// Стилизация попапа и его содержимого
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
                      options={[
                        {label: "Банк", value: "", isPlaceholder: true},
                        {label: "ПриватБанк", value: "privat"},
                        {label: "МоноБанк", value: "mono"},
                        {label: "ОщадБанк", value: "oshchad"},
                        {label: "УкрГазБанк", value: "urk_gaz"},
                        {label: "Райффайзен Банк", value: "raiffeisen"},
                        {label: "УкрСибБанк", value: "ukr_sib"},
                        {label: "Пумб", value: "pumb"},
                        {label: "А Банк", value: "a"},
                      ]}/>
            <Select label={"Выберете Реквизиты"}
                    width={'100%'}
                    options={[
                      {label: "Реквизиты", value: "", isPlaceholder: true},
                      {label: "*1234 матвиенко С.", value: 1},
                      {label: "*1234 Соболенко С.", value: 1},
                      {label: "*1234 Савченко С.", value: 1},
                    ]}/>
            <Button style={{width: "400px", marginTop: "16px"}} type="submit">Создать</Button>
          </form>
          <BackButton style={{marginTop: "8px"}} onClick={onClose}>Отменить</BackButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default CreateAdvertisementsModal;
