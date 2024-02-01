import privat from "../../assets/img/privat.png";
import {AutomationIcon, CardIcon, CopyIcon, KebabMenuIcon} from "../../UI/SVG";
import React from "react";
import styled from "styled-components";
import Switch from "../../components/common/Switch";
import DropDown from "../../components/common/DropDown";


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

const WarningsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const WalletWarning = styled.b`
    color: #F93D3D;

    font-family: 'Mulish', serif;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
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

const Section = styled.section`
    margin-top: 24px;
`;

const StyledCopyIcon = styled(CopyIcon)`
    fill: #46404B;
`;

const General = () => {

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
      <Section>
        <OptionTitle>Адрес пополнения баланса</OptionTitle>
        <WarningsWrapper>
          <WalletWarning>Внимание! Перевод средств принимается ТОЛЬКО внутри сети Trom TRC20.</WalletWarning>
          <WalletWarning>В противном случае средства будут утеряны, и мы не сможем Вам помочь. </WalletWarning>
        </WarningsWrapper>
        <WalletField>
          <WalletText>TYRJxtS4j1PQKUjY1KUsgX5ECV2N5hKimW</WalletText>
          <StyledCopyIcon/>
        </WalletField>
      </Section>
    </Wrapper>
  );
};

export default General;
