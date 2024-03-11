export enum UserType {
    TRADER = 1,
    MERCHANT = 2,
    ADMIN = 3,
}

export interface User {
    id: number;
    type: UserType;
}

export interface UserSchema {
    user?: User;
}
