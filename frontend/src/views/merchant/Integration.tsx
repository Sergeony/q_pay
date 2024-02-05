import React from "react";
import styled from "styled-components";
import {CopyIcon, EditIcon} from "../../UI/SVG";
import {StyledField} from "../../UI/CommonUI";
import {useFormik} from "formik";
import * as Yup from "yup";


const Wrapper = styled.div`

    font-family: 'Helvetica', serif;
    font-style: normal;
    font-weight: 400;
    line-height: normal;


    margin-left: 152px;

    margin-top: 8px;
    display: inline-block;
`;

const WalletField = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
`;

const WalletText = styled.span`
    color: #9E68F7;
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
`;

const StyledCopyIcon = styled(CopyIcon)`
    fill: #46404B;
`;

const Section = styled.section`
    margin-top: 24px;
`;

const OptionTitle = styled.div`
    margin-bottom: 16px;

    color: #46404B;
    font-size: 22px;
    font-weight: 700;
`;

const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.field_text_color};
`;

export const StyledContainer = styled.div`
    display: flex;
    padding: 16px;
    border-radius: 16px;
    border: ${({theme}) => theme.field_border};
    background: ${({theme}) => theme.field_background};
    width: 588px;
`;


const Integration = () => {
  const {createIntegration}: any = {};

  const formik = useFormik({
    initialValues: {
      siteUrl: '',
      successUrl: '',
      failedUrl: '',
      notificationUrl: '',
    },
    validationSchema: Yup.object().shape({
      siteUrl: Yup.string().required('URL обязателен'),
      successUrl: Yup.string().required('URL обязателен'),
      failedUrl: Yup.string().required('URL обязателен'),
      notificationUrl: Yup.string().required('URL обязателен'),
    }),
    onSubmit: async (values) => {
      await createIntegration({
        site_url: values.siteUrl,
        success_url: values.successUrl,
        failed_url: values.failedUrl,
        notification_url: values.notificationUrl,
      })
        .unwrap()
        .catch((error: any) => {
          formik.resetForm();
          console.error(`Ошибка создания интеграции`, error);
        });
    },
  });

  return (
    <Wrapper>
      <Section>
        <OptionTitle>Ваш API ключ</OptionTitle>
        <WalletField>
          <WalletText>TYRJxtS4j1PQKUjY1KUsgX5ECV2N5hKimW</WalletText>
          <StyledCopyIcon/>
        </WalletField>
      </Section>
      <form onSubmit={formik.handleSubmit}>
        <Section>
          <OptionTitle>Ваш сайт</OptionTitle>
          <StyledContainer>
            <DefaultField placeholder="Адрес электронной почты"
                          type="email"
                          name="email"
                          onChange={formik.handleChange}
                          value={formik.values.siteUrl}
                          onBlur={formik.handleBlur}
            />
            <EditIcon/>
          </StyledContainer>
        </Section>
        <Section>
          <OptionTitle>Успешный URL</OptionTitle>
          <StyledContainer>
            <DefaultField placeholder="Адрес электронной почты"
                          type="email"
                          name="email"
                          onChange={formik.handleChange}
                          value={formik.values.successUrl}
                          onBlur={formik.handleBlur}
            />
            <EditIcon/>
          </StyledContainer>
        </Section>
        <Section>
          <OptionTitle>Неудачный URL</OptionTitle>
          <StyledContainer>
            <DefaultField placeholder="Адрес электронной почты"
                          type="email"
                          name="email"
                          onChange={formik.handleChange}
                          value={formik.values.failedUrl}
                          onBlur={formik.handleBlur}
            />
            <EditIcon/>
          </StyledContainer>
        </Section>
        <Section>
          <OptionTitle>URL для уведомлений</OptionTitle>
          <StyledContainer>
            <DefaultField placeholder="Адрес электронной почты"
                          type="email"
                          name="email"
                          onChange={formik.handleChange}
                          value={formik.values.notificationUrl}
                          onBlur={formik.handleBlur}
            />
            <EditIcon/>
          </StyledContainer>
        </Section>
      </form>
    </Wrapper>

);
};

export default Integration;
