import { Field } from "shared/ui/Field/Field";
import { CopyIcon, SearchIcon } from "shared/ui/_SVG";
import { useParams } from "react-router-dom";
import { AdminUsersTab } from "shared/const/router";
import { NotFoundPage } from "pages/NotFoundPage";
import { useTranslation } from "react-i18next";
import { Button, ButtonRole } from "shared/ui/Button/Button";
import { useCallback, useState } from "react";
import { UsersTab } from "./UsersTab";
import { useCreateInviteCodeMutation } from "../api/usersService";

export const AdminUsersPage = () => {
    const { t } = useTranslation();
    const { tab } = useParams<{tab: AdminUsersTab}>();
    const [createInviteCode] = useCreateInviteCodeMutation();
    const [inviteLink, setInviteLink] = useState<string>("");

    const handleCreateInviteLink = useCallback(async () => {
        await createInviteCode({ userType: 1 })
            .unwrap()
            .then((data) => {
                const baseUrl = window.location.origin;
                setInviteLink(`${baseUrl}/register/?invite-code=${data.inviteCode}`);
            })
            .catch((error) => {
                console.error("Ошибка при создании кода приглашения", error);
            });
    }, [createInviteCode]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(inviteLink);
        setInviteLink("");
    };

    if (!tab || !["traders", "merchants"].includes(tab)) {
        return <NotFoundPage />;
    }

    return (
        <main className="v-stack gap-32 max-w-xl px-2rem">
            <div className="h-stack justifyBetween">
                <h2 className="PageTitle">
                    {tab === "traders"
                        ? t("admin_traders_page_title")
                        : t("admin_merchants_page_title")}
                </h2>
                <Field
                    label="Search user"
                    hideLabel
                    Icon={SearchIcon}
                    type="search"
                    onClick={() => {
                        console.log("search processed");
                    }}
                    placeholder={t("user_search_placeholder")}
                    className="search"
                />
                {
                    inviteLink ? (
                        <Field
                            label={t("invite_link_field_label")}
                            hideLabel
                            value={inviteLink}
                            readOnly
                            Icon={CopyIcon}
                            onIconClick={handleCopy}
                        />
                    ) : (
                        <Button
                            role={ButtonRole.PRIMARY}
                            onClick={handleCreateInviteLink}
                        >
                            {t("create_invite_link_btn")}
                        </Button>
                    )
                }
            </div>
            <UsersTab userRole={tab} />
        </main>
    );
};
