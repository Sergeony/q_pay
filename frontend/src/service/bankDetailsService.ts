import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from ".";
import { BankDetailsProps, setBankDetails } from "../store/reducers/bankDetailsSlice";


interface FetchBankDetailsRequestProps {
  user_id?: number;
}


export const bankDetailsApi = createApi({
  reducerPath: 'bankDetailsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["BankDetails"],
  endpoints: (builder) => ({
    fetchBankDetails: builder.query<BankDetailsProps[], FetchBankDetailsRequestProps>({
      query: (params) => ({
        url:'api/web/trader/bank_details/',
        params,
      }),
      providesTags: ["BankDetails"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setBankDetails(data));
        } catch (error) {
          // Обработка ошибок
        }
      },
    }),
    createBankDetails: builder.mutation<BankDetailsProps, any>({
      query: (body) => ({
        url: 'api/web/trader/bank_details/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["BankDetails"],
    }),
    updateBankDetails: builder.mutation<BankDetailsProps, Partial<BankDetailsProps> & Pick<BankDetailsProps, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `api/web/trader/bank_details/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["BankDetails"],
    }),
    deleteBankDetails: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `api/web/trader/bank_details/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["BankDetails"],
    }),
  }),
});

export const {
  useFetchBankDetailsQuery,
  useCreateBankDetailsMutation,
  useUpdateBankDetailsMutation,
  useDeleteBankDetailsMutation,
} = bankDetailsApi;
