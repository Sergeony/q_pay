import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {HmacSHA512, enc} from "crypto-js";
import {TransactionType} from "./transactionsService";
import {setTransaction} from "_store/reducers/clientTransactionSlice";

export interface TransactionRequest {
    amount: number;
    client_bank_id: number;
    type: TransactionType,
    order_id: string,
    client_id: string,
}

interface TransactionResponse {
    trader_bank_details: string;
    lifetime: number;
}


function generateHeaders(body: string, urlPath: string, method: string) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const secretKey = "a4825234f4bae72a0be04eafe9e8e2bada209255";
  const apiKey = "i00000000";
  const data = `${timestamp}${method}${urlPath}${body}`;
  const signature = HmacSHA512(data, secretKey).toString(enc.Hex);
  return {
    'X-Timestamp': timestamp,
    'X-Signature': signature,
    'Authorization': `Bearer ${apiKey}`,
  };
}

export const clientApi = createApi({
    reducerPath: 'clientApi',
    baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:8000'}),
    endpoints: (builder) => ({
        createTransaction: builder.mutation<any, any>({
            query: (body) => {
                const urlPath = '/api/v1/transactions/';
                const method = 'POST';
                const customHeaders = generateHeaders(JSON.stringify(body), urlPath, method);
                return {
                    url: urlPath,
                    method,
                    body,
                    headers: customHeaders,
                }
            },
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                  const { data } = await queryFulfilled;
                  dispatch(setTransaction(data));
                } catch (error) {
                  // Обработка ошибок
                }
            },
        }),
    }),
});

export const {
    useCreateTransactionMutation
} = clientApi;
