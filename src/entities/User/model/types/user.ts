export enum UserType {
    TRADER = 1,
    MERCHANT = 2,
    ADMIN = 3,
}

export interface User {
    id: string;
    email: string;
    type: UserType;
}
