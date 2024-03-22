import React from 'react';
import styled from 'styled-_components';
import {Button} from "../../__UI/CommonUI";
import {CrossIcon} from "../../__UI/SVG";


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
    padding: 31px;
    width: 500px; // Установите подходящую ширину
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


const ButtonsWrapper = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 32px;
`;

const CancelButton = styled.button`
    border: 1px solid #F93D3D;
    border-radius: 16px;
    padding: 11px 7px;
    background: none;
    color: #F93D3D;

    font-size: 16px;
    font-family: 'Mulish', serif;
    font-weight: 700;
`;

const Amount = styled.span`
    color: #9E68F7;
`;

const Description = styled.p`
    font-size: 16px;
    font-family: 'Mulish', serif;
    font-weight: 700;
    color: #0F0021;
    
    margin-top: 16px;
`;



interface IProps {
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmTransactionModal = ({onClose, onConfirm}: IProps) => {

  return (
    <PopupOverlay>
      <PopupContainer>
        <CloseButton onClick={onClose}>
          <CrossIcon/>
        </CloseButton>
        <Title>Вы уверены что выполнили условия сделки?</Title>
        {/*<Description>Вы уверены, что уже отправили <Amount>1 345 UAH</Amount> по указаным реквизитам?</Description>*/}
        <ButtonsWrapper>
          <Button style={{width: '275px'}} onClick={onConfirm}>Подтвердить перевод</Button>
          <CancelButton>Отменить сделку</CancelButton>
        </ButtonsWrapper>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default ConfirmTransactionModal;
