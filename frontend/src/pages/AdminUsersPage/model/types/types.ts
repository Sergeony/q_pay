import { Balance } from "entities/Balance";

export interface UserForAdmin {
    id: number;
    email: string;
    totalTransactions: string;
    balance: Balance;
    isActive: boolean;
    isOnline: boolean;
}
