import { api } from "shared/api/api";
import { BankSchema } from "../model/types/BankSchema";
import { bankActions } from "../model/slices/BankSlice";

const banksApi = api.injectEndpoints({
    endpoints: (builder) => ({
        fetchBanks: builder.query<BankSchema[], void>({
            query: () => ({
                url: "api/web/banks/"
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(bankActions.setBanks(data));
                } catch (error) {
                    // TODO: Обработка ошибок
                }
            },
            providesTags: ["Banks"],
        }),
    }),
});

export const {
    useFetchBanksQuery,
} = banksApi;
