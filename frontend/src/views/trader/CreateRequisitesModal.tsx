import React, {useState} from 'react';
import styled from 'styled-components';
import {BackButton, Button, StyledField} from "../../UI/CommonUI";
import DropDown from "../../components/common/DropDown";
import Select from "../../components/common/DropDown";
import {Form, Formik } from 'formik';
import * as Yup from "yup";
import {CrossIcon} from "../../UI/SVG";

const RegistrationSchema = Yup.object().shape({
  bank: Yup.string().required('Required'),
  cardNumber: Yup.string().min(8, '').required('Required'),
  name: Yup.string().min(8, '').required('Required'),
  title: Yup.string().min(8, ''),
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

const CreateRequisitesModal = ({onClose}: IProps) => {
  return (
    <PopupOverlay>
      <PopupContainer>
        <CloseButton onClick={onClose}>
          <CrossIcon/>
        </CloseButton>
        <Title>Создание объявления</Title>
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={RegistrationSchema}
          onSubmit={() => {
            return
          }}
        >
          <Form>
              <DropDown
                        label={'Выберите банк'}
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
            <label>Номер карты</label>
            <FormField>
              <StyledField name="cardNumber" type="text"/>
            </FormField>

            <label>Фамилия и Имя</label>
            <FormField>
              <StyledField name="name" type="text"/>
            </FormField>

            <label>Название Реквизитов</label>
            <FormField>
              <StyledField name="title" type="text"/>
            </FormField>
            <Button style={{width: "400px", marginTop: "16px"}}>Создать</Button>
          </Form>
        </Formik>
        <BackButton style={{marginTop: "8px"}} onClick={onClose}>Отменить</BackButton>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default CreateRequisitesModal;
