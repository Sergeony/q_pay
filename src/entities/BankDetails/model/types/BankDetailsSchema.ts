export interface BankDetails {
    id: number;
    title: string;
    cardNumber: string;
    cardholderName: string;
    bank: number,
    dailyLimit: number;
    weeklyLimit: number;
    monthlyLimit: number;
    currentDailyTurnover: number;
    currentWeeklyTurnover: number;
    currentMonthlyTurnover: number;
    useAutomation: boolean;
    isActive: boolean;
    ad: number;
}

export interface BankDetailsSchema {
    items: BankDetails[];
}
