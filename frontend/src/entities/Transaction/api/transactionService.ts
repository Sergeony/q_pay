import { api } from "shared/api/api";
import { Transaction } from "../model/types/Transaction";
import {
    TransactionStatusGroup,
    TransactionType
} from "../model/consts/consts";

export interface GetTransactionsRequestProps {
    type: TransactionType;
    statusGroup?: TransactionStatusGroup;
    userId?: string;
}

const transactionsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getTransactions: builder.query<
        Transaction[],
        GetTransactionsRequestProps
        >({
            query: (params) => ({
                url: "api/web/trader/transactions/",
                params: {
                    type: params.type,
                    statusGroup: params.statusGroup,
                    user_id: params.userId,
                },
            }),
            providesTags: ["Deposit"],
        }),
    }),
});

export const {
    useLazyGetTransactionsQuery,
} = transactionsApi;
