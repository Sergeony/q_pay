import { createApi } from '@reduxjs/toolkit/query/react';
import {BankDetailsProps} from "_store/reducers/bankDetailsSlice";
import {baseQueryWithReauth} from "./index";


export enum TransactionType {
  DEPOSIT = 1,
  WITHDRAWAL = 2,
}

export enum TransactionStatus {
  REJECTED = 1,
  PENDING = 2,
  CANCELLED = 3,
  REVIEWING = 4,
  DISPUTING = 5,
  COMPLETED = 6,
  FAILED = 7,
  PARTIAL = 8,
  REFUND_REQUESTED = 9,
  REFUNDING = 10,
  REFUNDED = 11,
  REFUND_FAILED = 12,
  REDIRECT = 13,
}


export interface TransactionProps {
  id: string;
  order_id: string;
  type: TransactionType;
  trader: number;
  merchant: number;
  status: TransactionStatus;
  amount: number;
  actual_amount: number;
  trader_commission: string;
  service_commission: string;
  currency: number;
  created_at: string;
  completed_at: string | null;
  finished_at: string | null;
  lifetime: number;
  trader_bank_details: BankDetailsProps;
  client_card_number?: string;
  client_bank: number;
  client_id: string;
  client_ip: string;
  use_automation: boolean;
  receipt_url?: string;
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
  tagTypes: ["Deposit", "Withdrawal"],
  endpoints: (builder) => ({
    getDepositTransactions: builder.query<TransactionProps[], GetTransactionsRequestProps>({
      query: ({statusGroup, ...params}) => ({
        url: `api/web/trader/transactions/deposit/${statusGroup ? statusGroup + '/' : ''}`,
        params,
      }),
      providesTags: ["Deposit"],
    }),
    getWithdrawalTransactions: builder.query<TransactionProps[], GetTransactionsRequestProps>({
      query: ({statusGroup, ...params}) => ({
        url: `api/web/trader/transactions/withdrawal/${statusGroup ? statusGroup + '/' : ''}`,
        params,
      }),
      providesTags: ["Withdrawal"]

    }),
    getMerchantDepositTransactions: builder.query<TransactionProps[], GetMerchantTransactionsRequestProps>({
      query: (params) => ({
        url: 'api/web/merchant/transactions/deposit/',
        params
      }),
      providesTags: ["Deposit"]

    }),
    getMerchantWithdrawalTransactions: builder.query<TransactionProps[], GetMerchantTransactionsRequestProps>({
        query: (params) => ({
          url: 'api/web/merchant/transactions/withdrawal/',
          params,
        }),
        providesTags: ["Withdrawal"]
    }),
  }),
});

export const {
  useGetDepositTransactionsQuery,
  useGetWithdrawalTransactionsQuery,
  useLazyGetDepositTransactionsQuery,
  useLazyGetWithdrawalTransactionsQuery,
  useGetMerchantDepositTransactionsQuery,
  useGetMerchantWithdrawalTransactionsQuery,

} = transactionsApi;
