export { BankSchema } from "./model/types/BankSchema";
export {
    useFetchBanksQuery,
} from "./api/bankService";
export {
    bankReducer,
    bankActions,
} from "./model/slices/BankSlice";
export {
    getBanks,
} from "./model/selectors/getBanks";
