import { createApi } from '@reduxjs/toolkit/query/react';
import {RequisitesProps} from "../store/reducers/requisitesSlice";
import {baseQuery} from "./index";

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

interface GetCompletedTransactionsRequestProps {
  trader_id?: number;
}

export const transactionsApi = createApi({
  reducerPath: 'transactionsApi',
  baseQuery,
  tagTypes: ["Input", "Output"],
  endpoints: (builder) => ({
    getInputCompletedTransactions: builder.query<TransactionProps[], GetCompletedTransactionsRequestProps>({
      query: (params) => ({
        url: 'api/v1/trader/transactions/input/completed/',
        params,
      }),
      providesTags: ["Input"],
    }),
    getInputDisputedTransactions: builder.query<TransactionProps[], void>({
      query: () => 'api/v1/trader/transactions/input/disputed/',
      providesTags: ["Input"]
    }),
    getOutputCompletedTransactions: builder.query<TransactionProps[], GetCompletedTransactionsRequestProps>({
      query: (params) => ({
        url: 'api/v1/trader/transactions/output/completed/',
        params,
      }),
      providesTags: ["Output"]

    }),
    getOutputDisputedTransactions: builder.query<TransactionProps[], void>({
      query: () => 'api/v1/trader/transactions/output/disputed/',
      providesTags: ["Output"]

    }),
  }),
});

export const {
  useGetInputCompletedTransactionsQuery,
  useGetInputDisputedTransactionsQuery,
  useGetOutputCompletedTransactionsQuery,
  useGetOutputDisputedTransactionsQuery,
} = transactionsApi;
