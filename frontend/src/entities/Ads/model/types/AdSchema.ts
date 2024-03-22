interface BankDetails {
    id: number;
    title: string;
    cardholderName: string;
    cardNumber: string;
    useAutomation: boolean;
}

export interface AdSchema {
    id: number;
    bank: number;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    bankDetails: BankDetails[];
}
