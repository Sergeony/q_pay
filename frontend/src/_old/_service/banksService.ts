import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQueryWithReauth} from "./index";
import {BankProps, setBanks} from "_store/reducers/banksSlice";


export const banksApi = createApi({
  reducerPath: 'banksApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Banks"],
  endpoints: (builder) => ({
    fetchBanks: builder.query<BankProps[], void>({
      query: () => ({
        url: 'api/web/banks/'
      }),
      providesTags: ["Banks"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBanks(data));
        } catch (error) {
          // Обработка ошибок
        }
      }
    }),
  }),
})

export const {
  useFetchBanksQuery,
} = banksApi;
