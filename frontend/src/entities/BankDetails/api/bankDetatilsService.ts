import { api } from "shared/api/api";
import { bankDetailsActions } from "../model/slices/bankDetailsSlice";
import { BankDetails } from "../model/types/BankDetailsSchema";

interface FetchBankDetailsRequestProps {
    userId?: string;
}

export interface PatchBankDetailsRequest {
    id: number;
    isActive?: boolean;
}

const bankDetailsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        fetchBankDetails: builder.query<BankDetails[], FetchBankDetailsRequestProps>({
            query: ({ userId }) => ({
                url: "api/web/trader/bank_details/",
                params: {
                    user_id: userId,
                },
            }),
            providesTags: ["BankDetails"],
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(bankDetailsActions.setBankDetails(data));
                } catch (error) {
                    // Обработка ошибок
                }
            },
        }),
        createBankDetails: builder.mutation<BankDetails, any>({
            query: (body) => ({
                url: "api/web/trader/bank_details/",
                method: "POST",
                body,
            }),
            invalidatesTags: ["BankDetails"],
        }),
        patchBankDetails: builder.mutation<BankDetails, PatchBankDetailsRequest>({
            query: ({ id, ...body }) => ({
                url: `api/web/trader/bank_details/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["BankDetails"],
        }),
        deleteBankDetails: builder.mutation<{ success: boolean; id: number }, { id: number }>({
            query: ({ id }) => ({
                url: `api/web/trader/bank_details/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["BankDetails"],
        }),
    }),
});

export const {
    useFetchBankDetailsQuery,
    useLazyFetchBankDetailsQuery,
    useCreateBankDetailsMutation,
    usePatchBankDetailsMutation,
    useDeleteBankDetailsMutation,
} = bankDetailsApi;
