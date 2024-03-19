import { api } from "shared/api/api";
import { Transaction } from "entities/Transaction/model/types/Transaction";
import { TransactionStatusGroup, TransactionType } from "../model/consts/consts";

export interface GetTransactionsRequestProps {
    type: TransactionType;
    statusGroup?: TransactionStatusGroup;
    userId?: number;
}

interface GetMerchTransactionsRequestProps {
    merchant_id?: number;
}

const transactionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query<Transaction[], GetTransactionsRequestProps>({
            query: (params) => ({
                url: "api/web/trader/transactions/",
                params,
            }),
            providesTags: ["Deposit"],
        }),
        getWithdrawalTransactions: builder.query<Transaction[], GetTransactionsRequestProps>({
            query: ({ statusGroup, ...params }) => ({
                url: `api/web/trader/transactions/withdrawal${statusGroup && `/${statusGroup}`}`,
                params,
            }),
            providesTags: ["Withdrawal"]

        }),
        getMerchantDepositTransactions: builder.query<Transaction[], GetMerchTransactionsRequestProps>({
            query: (params) => ({
                url: "api/web/merchant/transactions/deposit/",
                params
            }),
            providesTags: ["Deposit"]

        }),
        getMerchantWithdrawalTransactions: builder.query<Transaction[], GetMerchTransactionsRequestProps>({
            query: (params) => ({
                url: "api/web/merchant/transactions/withdrawal/",
                params,
            }),
            providesTags: ["Withdrawal"]
        }),
    }),
});

export const {
    useGetTransactionsQuery,
    useLazyGetTransactionsQuery,
    useGetWithdrawalTransactionsQuery,
    useGetMerchantDepositTransactionsQuery,
    useGetMerchantWithdrawalTransactionsQuery,
} = transactionsApi;
