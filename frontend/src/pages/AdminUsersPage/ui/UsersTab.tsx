import { memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { AdminUsersTab, getRouteAdminUserDetails, getRoutePayForAdmin } from "shared/const/router";
import Switch from "shared/ui/Switch/Switch";
import KebabMenu from "shared/ui/KebabMenu/KebabMenu";
import { Link } from "react-router-dom";
import cls from "./AdminUsersPage.module.scss";
import { useDeleteUserMutation, useGetUsersQuery, usePatchUserMutation } from "../api/usersService";

interface UserTabProps {
    userRole: AdminUsersTab;
}

export const UsersTab = memo((props: UserTabProps) => {
    const { t } = useTranslation();
    const { userRole } = props;
    const {
        data: users,
        isSuccess: usersFetched,
    } = useGetUsersQuery(
        { userRole },
        { refetchOnMountOrArgChange: true }
    );
    const [deleteUser] = useDeleteUserMutation();
    const [toggleUserActivity] = usePatchUserMutation();

    const handleDelete = useCallback((id: number) => {
        deleteUser({ userRole, id })
            .unwrap()
            .catch((error) => {
                console.error("Error while deleting user:", error);
            });
    }, [deleteUser, userRole]);

    const handleToggle = useCallback((id: number, isActive: boolean) => {
        toggleUserActivity({ userRole, id, isActive })
            .unwrap()
            .catch((error) => {
                console.error("Error while toggling user activity:", error);
            });
    }, [toggleUserActivity, userRole]);

    return (
        <div className={`table ${cls.UsersGridTemplate}`}>
            <div>
                <span>{t("admin_users_table_col_title_email")}</span>
                <span>{t("admin_users_table_col_title_user_id")}</span>
                <span>{t("admin_users_table_col_title_transactions")}</span>
                <span>{t("admin_users_table_col_title_balance")}</span>
                <span>{t("admin_users_table_col_title_is_active")}</span>
                <span />
            </div>
            {usersFetched && users.map((u) => (
                <div key={u.id}>
                    <div>
                        <span>
                            <Link
                                to={`${getRouteAdminUserDetails(userRole, String(u.id))}/`
                                    + `${getRoutePayForAdmin("in")}`}
                            >
                                {u.email}
                            </Link>
                        </span>
                    </div>
                    <div><span>{u.id}</span></div>
                    <div><span>{u.totalTransactions}</span></div>
                    <div><span>{u.balance.activeBalance}</span></div>
                    <div>
                        <Switch
                            isActive={u.isActive}
                            onSwitch={() => handleToggle(u.id, !u.isActive)}
                        />
                    </div>
                    <div>
                        <KebabMenu
                            onDelete={() => handleDelete(u.id)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});
