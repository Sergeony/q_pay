import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {BankProps, setBanks} from "../store/reducers/banksSlice";


interface TraderProps {
  id: number;
  email: string;
  is_online: boolean;
  total_transactions: number;
  balance: number;
  is_activated: boolean;
}

interface DeleteTraderRequestProps {
  id: number;
}

interface UpdateTraderRequestProps {
  id: number;
  is_activated: boolean;
}

interface FetchTraderStatsRequestProps {
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
  tagTypes: ["Trader"],
  endpoints: (builder) => ({
    createInviteCode: builder.mutation<CreateInviteCodeResponseProps, CreateInviteCodeRequestProps>({
      query: (body) => ({
        url: `api/v1/admin/invite/`,
        method: 'POST',
        body
      }),
    }),
    fetchTraders: builder.query<TraderProps[], void>({
      query: () => ({
        url: 'api/v1/admin/traders/'
      }),
      providesTags: ["Trader"],
    }),
    deleteTrader: builder.mutation<any, DeleteTraderRequestProps>({
      query: ({id}: DeleteTraderRequestProps) => ({
        url: `api/v1/admin/traders/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Trader"],
    }),
    updateTrader: builder.mutation<any, UpdateTraderRequestProps>({
      query: ({id, ...body}: UpdateTraderRequestProps) => ({
        url: `api/v1/admin/traders/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["Trader"],
    }),
    fetchTraderStats: builder.query<TraderProps, FetchTraderStatsRequestProps>({
      query: ({id}: FetchTraderStatsRequestProps)=> ({
        url: `api/v1/admin/traders/${id}/stats/`,
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
} = adminApi;
