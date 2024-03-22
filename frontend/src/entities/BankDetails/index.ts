export {
    BankDetailsSchema,
} from "./model/types/BankDetailsSchema";
export {
    useFetchBankDetailsQuery,
    useLazyFetchBankDetailsQuery,
    useCreateBankDetailsMutation,
    usePatchBankDetailsMutation,
    useDeleteBankDetailsMutation,
} from "./api/bankDetatilsService";
export {
    bankDetailsReducer,
    bankDetailsActions,
} from "./model/slices/bankDetailsSlice";
export {
    getBankDetails,
} from "./model/selectors/getBankDetails";
