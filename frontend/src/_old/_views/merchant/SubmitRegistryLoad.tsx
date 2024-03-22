import React, {useState} from 'react';
import styled from 'styled-_components';
import {BackButton, Button} from "../../__UI/CommonUI";
import {Form, Formik} from 'formik';
import * as Yup from "yup";
import {CrossIcon, UploadIcon} from "../../__UI/SVG";
import { hostUrl } from '../../../src/_service';

const RegistrationSchema = Yup.object().shape({
  receipt: Yup.mixed().required('File is required'),
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


const FileInputWrapper = styled.label`
    justify-content: center;
    align-items: center;
    cursor: pointer;
    
    display: flex;
    padding: 12px;
    border-radius: 16px;
    border: ${({theme}) => theme.field_border};
    background: ${({theme}) => theme.field_background};
    
    gap: 16px;
`;

const FileInput = styled.input`
    display: none;
`;

const FileName = styled.span`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px;
`;



interface IProps {
  onClose: () => void;
}

const SubmitRegistryLoad = ({onClose}: IProps) => {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setFile(file);
    }
  };

  const handleSubmit = (event: any) => {
    if (file === null)
      return
    const formData = new FormData();
    formData.append("file", file);
    fetch(`${hostUrl}/api/web/merchant/transactions/withdrawal/upload/`, {
      method: 'POST',
      body: formData,
    })
  }

  return (
    <PopupOverlay>
      <PopupContainer>
        <CloseButton onClick={onClose}>
          <CrossIcon/>
        </CloseButton>
        <Title></Title>
        <Formik
          initialValues={{email: '', password: ''}}
          validationSchema={RegistrationSchema}
          onSubmit={() => {
            return
          }}
        >
          <Form>
            <FileInputWrapper>
              <FileInput
                name="registry"
                type="file"
                onChange={handleFileChange}
                id="file-upload"
              />
              <UploadIcon/>
              <FileName title={fileName}>{fileName || "Выбрать файл"}</FileName>
            </FileInputWrapper>

            <p>Допустимые форматы: <span>CSV, XLSX</span></p>
            <Button style={{width: "400px", marginTop: "16px"}}
                    onClick={handleSubmit}>Выгрузить</Button>
          </Form>
        </Formik>
      </PopupContainer>
    </PopupOverlay>
  );
};

export default SubmitRegistryLoad;
