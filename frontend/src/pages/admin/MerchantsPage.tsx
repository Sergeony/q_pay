import React, {useState} from 'react';
import styled from "styled-components";
import {
  Button,
  PageWrapper, StyledField,
} from "../../UI/CommonUI";
import Search from "../../components/common/Search";
import AdminHeader from "../../components/admin/AdminHeader";
import {useCreateInviteCodeMutation} from "../../service/adminService";
import {CopyIcon} from "../../UI/SVG";
import Merchants from '../../views/admin/Merchants';


const ContentWrapper = styled.div`
    grid-column-gap: 20px;
    width: 78.13vw;
    margin: 0 auto;
`;

const TitleWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-column-gap: 20px;
    justify-content: space-between;
    align-items: center;
    margin-top: 78px;
    margin-bottom: 32px;
`;


const Title = styled.span`
    font-family: 'Mulish', serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0;
    text-align: left;
    color: #0F0021;
    font-style: normal;
    line-height: normal;

    grid-column: 2/4;

`;

const SearchWrapper = styled.div`
    grid-column: 4/7;
`;

const UnloadRegistryWrapper = styled.div`
    grid-column: 10;
`;

const DefaultField = styled(StyledField)`
    color: ${({theme}) => theme.field_text_color};
`;

export const StyledContainer = styled.div`
    display: flex;
    padding: 12px;
    border-radius: 16px;
    border: ${({theme}) => theme.field_border};
    background: ${({theme}) => theme.field_background};
    width: 284px;
    height: 44px;
`;

const MerchantsPage = () => {
  const [createInviteCode] = useCreateInviteCodeMutation();
  const [inviteLink, setInviteLink] = useState<string>('');

  const handleCreateInviteLink = async () => {
    await createInviteCode({
      user_type: 2,
    })
      .unwrap()
      .then((data) => {
        const baseUrl = window.location.origin;
        setInviteLink(`${baseUrl}/sign-up/?invite-code=${data.invite_code}`);
      })
      .catch((error) => {
        console.error("Ошибка при создании кода приглашения для мерчанта", error)
      })
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setInviteLink('');
  };


  return (
    <PageWrapper>
      <AdminHeader/>
      <ContentWrapper>
        <TitleWrapper>
          <Title>Пополнение</Title>
          <SearchWrapper>
            <Search placeholder={"ID Мерчанта / Логин"}
                    onSearch={() => {
                      console.log("search precessed")
                    }}
            />
          </SearchWrapper>
          <UnloadRegistryWrapper>
            {inviteLink ?
              <StyledContainer onClick={handleCopy}>
                <DefaultField value={inviteLink}
                />
                <CopyIcon />
              </StyledContainer>
              :
              <Button style={{width: "284px"}}
                      onClick={handleCreateInviteLink}>
                Создать ссылку-приглошение
              </Button>
            }
          </UnloadRegistryWrapper>
        </TitleWrapper>

        <Merchants/>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default MerchantsPage;
