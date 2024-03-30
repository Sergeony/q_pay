import { TransactionStatus, TransactionType } from "../consts/consts";

interface TraderBankDetails {
    title: string;
    cardholderName: string;
    cardNumber: string;
    bank: number;
}

export interface Transaction {
    id: string;
    orderId: string;
    type: TransactionType;
    trader: number;
    merchant: number;
    status: TransactionStatus;
    amount: number;
    actualAmount: number;
    traderCommission: number;
    serviceCommission: number;
    // rate: number;
    currency: number;
    createdAt: string;
    completedAt: string | null;
    finishedAt: string | null;
    lifetime: string;
    traderBankDetails: TraderBankDetails;
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
