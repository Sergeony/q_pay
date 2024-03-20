import { TransactionStatus, TransactionType } from "../consts/consts";

export interface Transaction {
    id: string;
    orderId: string;
    type: TransactionType;
    trader: number;
    merchant: number;
    status: TransactionStatus;
    amount: number;
    actualAmount: number;
    traderCommission: string;
    serviceCommission: string;
    currency: number;
    createdAt: string;
    completedAt: string | null;
    finishedAt: string | null;
    lifetime: string;
    traderBankDetails: number;
    clientCardNumber?: string;
    clientBank: number;
    clientId: string;
    clientIp: string;
    useAutomation: boolean;
    receiptUrl?: string;
}

export interface TransactionSchema {
    items: Transaction[];
}
