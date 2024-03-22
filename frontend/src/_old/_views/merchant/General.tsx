import {EditIcon} from "../../__UI/SVG";
import React from "react";
import styled from "styled-_components";
import DropDown from "../../_components/common/DropDown";
import {StyledField} from "../../__UI/CommonUI";
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

const OptionTitle = styled.div`
    margin-bottom: 16px;

    color: #46404B;
    font-size: 22px;
    font-weight: 700;
`;

const Email = styled.span`
    color: #9E68F7;
    font-family: 'Mulish', serif;
    font-size: 16px;
    font-weight: 700;
`;

const EmailDescription = styled.p`
    color: #46404B;

    font-family: 'Mulish', serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    margin: 8px 0 24px;
`;

const Section = styled.section`
    margin-top: 24px;
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
    width: 436px;
`;

const General = () => {
  const {changePassword}: any = {};

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required('Пароль обязателен'),
    }),
    onSubmit: async (values) => {
      await changePassword({
        password: values.password,
      })
        .unwrap()
        .catch((error: any) => {
          formik.resetForm();
          console.error(`Ошибка смены пароля`, error);
        });
    },
  });

  return (
    <Wrapper>
      <Section>
        <OptionTitle>Электронная почта</OptionTitle>
        <Email>sergkong@gmail.com</Email>
        <EmailDescription>Для смены электронной почты, обратитесь в поддержку.</EmailDescription>
        <DropDown label={"Выберите часовой пояс"}
                  value={{label: "GMT+0", value: 1}}
                  width={"284px"}
                  options={[
                    {label: "GMT+0", value: 1},
                    {label: "GMT+1", value: 2},
                    {label: "GMT+2", value: 3},
                    {label: "GMT+3", value: 4},
                    {label: "GMT+4", value: 5},
                    {label: "GMT+5", value: 6},
                    {label: "GMT+6", value: 7},
                    {label: "GMT+7", value: 8},
                    {label: "GMT+8", value: 9},
                    {label: "GMT+9", value: 10},
                    {label: "GMT+10", value: 11},
                    {label: "GMT+11", value: 12},
                  ]}
        />
      </Section>
      <form onSubmit={formik.handleSubmit}>
        <Section>
          <OptionTitle>Пароль</OptionTitle>
          <StyledContainer>
            <DefaultField placeholder="Пароль"
                          type="password"
                          name="password"
                          onChange={formik.handleChange}
                          value={formik.values.password}
                          onBlur={formik.handleBlur}
            />
            <EditIcon/>
          </StyledContainer>
        </Section>
      </form>
    </Wrapper>
);
};

export default General;
