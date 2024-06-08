import { api } from "shared/api/api";
import { UserForAdmin } from "../model/types/types";

interface CreateInviteCodeRequestProps {
    userType: number;
}

interface CreateInviteCodeResponseProps {
    inviteCode: string;
}

export interface GetTransactionsRequestProps {
    userRole: "traders" | "merchants";
}

interface DeleteUserRequestProps {
    userRole: "traders" | "merchants";
    id: number;
}

interface UpdateUserRequestProps {
    userRole: "traders" | "merchants";
    id: number;
    isActive: boolean;
}

const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createInviteCode: builder.mutation<
        CreateInviteCodeResponseProps,
        CreateInviteCodeRequestProps
        >({
            query: (body) => ({
                url: "api/web/admin/invite/",
                method: "POST",
                body,
            }),
        }),

        getUsers: builder.query<
        UserForAdmin[],
        GetTransactionsRequestProps
        >({
            query: ({ userRole }) => ({
                url: `api/web/admin/${userRole}/`,
            }),
            providesTags: ["Users"],
        }),

        deleteUser: builder.mutation<any, DeleteUserRequestProps>({
            query: ({ id, userRole }: DeleteUserRequestProps) => ({
                url: `api/web/admin/${userRole}/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Users"],
        }),
        patchUser: builder.mutation<any, UpdateUserRequestProps>({
            query: ({ id, userRole, ...body }: UpdateUserRequestProps) => ({
                url: `api/web/admin/${userRole}/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Users"],
        }),
        // fetchUserStats: builder.query<UserProps, FetchUserStatsRequestProps>({
        //     query: ({ id }: FetchUserStatsRequestProps) => ({
        //         url: `api/web/admin/traders/${id}/stats/`,
        //     })
        // }),  // TODO: uncomment when stats tab is implemented
    }),
});

export const {
    useCreateInviteCodeMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    usePatchUserMutation,
} = usersApi;
