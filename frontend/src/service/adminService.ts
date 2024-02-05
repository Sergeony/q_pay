import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";

interface UserProps {
  id: number;
  email: string;
  is_online: boolean;
  total_transactions: number;
  balance: number;
  is_activated: boolean;
}

interface DeleteUserRequestProps {
  id: number;
}

interface UpdateUserRequestProps {
  id: number;
  is_activated: boolean;
}

interface FetchUserStatsRequestProps {
  id: number;
}

interface CreateInviteCodeResponseProps {
  invite_code: string;
}

interface CreateInviteCodeRequestProps {
  user_type: number;
}


export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: ["Trader", "Merchant"],
  endpoints: (builder) => ({
    createInviteCode: builder.mutation<CreateInviteCodeResponseProps, CreateInviteCodeRequestProps>({
      query: (body) => ({
        url: `api/v1/admin/invite/`,
        method: 'POST',
        body
      }),
    }),

    fetchTraders: builder.query<UserProps[], void>({
      query: () => ({
        url: 'api/v1/admin/traders/'
      }),
      providesTags: ["Trader"],
    }),
    deleteTrader: builder.mutation<any, DeleteUserRequestProps>({
      query: ({id}: DeleteUserRequestProps) => ({
        url: `api/v1/admin/traders/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Trader"],
    }),
    updateTrader: builder.mutation<any, UpdateUserRequestProps>({
      query: ({id, ...body}: UpdateUserRequestProps) => ({
        url: `api/v1/admin/traders/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["Trader"],
    }),
    fetchTraderStats: builder.query<UserProps, FetchUserStatsRequestProps>({
      query: ({id}: FetchUserStatsRequestProps)=> ({
        url: `api/v1/admin/traders/${id}/stats/`,
      })
    }),

    fetchMerchants: builder.query<UserProps[], void>({
      query: () => ({
        url: 'api/v1/admin/merchants/'
      }),
      providesTags: ["Merchant"],
    }),
    deleteMerchant: builder.mutation<any, DeleteUserRequestProps>({
      query: ({id}: DeleteUserRequestProps) => ({
        url: `api/v1/admin/merchants/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Merchant"],
    }),
    updateMerchant: builder.mutation<any, UpdateUserRequestProps>({
      query: ({id, ...body}: UpdateUserRequestProps) => ({
        url: `api/v1/admin/merchants/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["Merchant"],
    }),
    fetchMerchantStats: builder.query<UserProps, FetchUserStatsRequestProps>({
      query: ({id}: FetchUserStatsRequestProps)=> ({
        url: `api/v1/admin/merchants/${id}/stats/`,
      })
    }),
  }),
})

export const {
  useCreateInviteCodeMutation,

  useFetchTradersQuery,
  useDeleteTraderMutation,
  useUpdateTraderMutation,
  useFetchTraderStatsQuery,

  useFetchMerchantsQuery,
  useDeleteMerchantMutation,
  useUpdateMerchantMutation,
  useFetchMerchantStatsQuery,
} = adminApi;
