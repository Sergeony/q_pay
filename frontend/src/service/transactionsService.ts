import { createApi } from '@reduxjs/toolkit/query/react';
import {RequisitesProps} from "../store/reducers/requisitesSlice";
import {baseQueryWithReauth} from ".";

export interface TransactionProps {
  id: string;
  status: number;
  trader: number;
  merchant: number;
  created_at: string;
  confirmed_at: string | null;
  finished_at: string | null;
  requisites: RequisitesProps;
  trader_usdt_rate: string;
  exchange_usdt_rate: string;
  automation_used: boolean;
  claimed_amount?: string;
  actual_amount?: string;
  amount?: string;
}

export interface GetTransactionsRequestProps {
  statusGroup?: 'active' | 'completed' | 'disputed' | 'checking';
  trader_id?: number;
}

interface GetMerchantTransactionsRequestProps {
  merchant_id?: number;
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Input", "Output"],
  endpoints: (builder) => ({
    getInputTransactions: builder.query<TransactionProps[], GetTransactionsRequestProps>({
      query: ({statusGroup, ...params}) => ({
        url: `api/v1/trader/transactions/input/${statusGroup ? statusGroup + '/' : ''}`,
        params,
      }),
      providesTags: ["Input"],
    }),
    getOutputTransactions: builder.query<TransactionProps[], GetTransactionsRequestProps>({
      query: ({statusGroup, ...params}) => ({
        url: `api/v1/trader/transactions/output/${statusGroup ? statusGroup + '/' : ''}`,
        params,
      }),
      providesTags: ["Output"]

    }),
    getMerchantInputTransactions: builder.query<TransactionProps[], GetMerchantTransactionsRequestProps>({
      query: (params) => ({
        url: 'api/v1/merchant/transactions/input/',
        params
      }),
      providesTags: ["Input"]

    }),
    getMerchantOutputTransactions: builder.query<TransactionProps[], GetMerchantTransactionsRequestProps>({
        query: (params) => ({
          url: 'api/v1/merchant/transactions/output/',
          params,
        }),
        providesTags: ["Output"]
    }),
  }),
});

export const {
  useGetInputTransactionsQuery,
  useGetOutputTransactionsQuery,

  useGetMerchantInputTransactionsQuery,
  useGetMerchantOutputTransactionsQuery,

} = transactionsApi;
