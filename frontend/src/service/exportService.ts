import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from ".";

interface ExportProps {
  transactionsType: 'deposit' | 'withdrawal';
  bank?: number;
  bank_details?: number;
  from?: string;
  to?: string;
}


export const exportApi = createApi({
  reducerPath: 'exportApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    exportTransactions: builder.query<any, ExportProps>({
      queryFn: async ({ transactionsType, ...params}: ExportProps, api, extraOptions, baseQuery) => {
        const result: any = await baseQuery({
          url: `/api/web/trader/transactions/export/${transactionsType}/`,
          params: params,
          responseHandler: ((response) => response.blob())
        })
        const hiddenElement = document.createElement('a');
        const url = window.URL || window.webkitURL;
        hiddenElement.href = url.createObjectURL(result.data);
        hiddenElement.target = '_blank';
        hiddenElement.download = `trans.xlsx`;
        hiddenElement.click();
        return { data: null }
      },
    }),
  }),
});

export const {
  useLazyExportTransactionsQuery,
} = exportApi;
