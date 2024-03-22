export interface Balance {
    activeBalance: number;
    frozenBalance?: number;
}

export interface BalanceSchema {
    data?: Balance;
}
