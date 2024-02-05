import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {BankProps, setBanks} from "../store/reducers/banksSlice";


export const banksApi = createApi({
  reducerPath: 'banksApi',
  baseQuery,
  tagTypes: ["Banks"],
  endpoints: (builder) => ({
    fetchBanks: builder.query<BankProps[], void>({
      query: () => ({
        url: 'api/v1/banks/'
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
