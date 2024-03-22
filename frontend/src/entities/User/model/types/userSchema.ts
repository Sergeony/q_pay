export enum UserType {
    TRADER = 1,
    MERCHANT = 2,
    ADMIN = 3,
}

export interface UserData {
    id: number;
    type: UserType;
}

export interface UserPrefs {
    theme: "light" | "dark";
    lang: string;
    tz: string;
    isActive: boolean;
}

export interface UserSchema {
    data?: UserData,
    prefs?: UserPrefs,
}
