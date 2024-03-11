export interface AuthSchema {
    email: string;
    totpBase32: string;
    tt: string;
}

export interface DecodedTokenProps {
    userType: number;
    id: number;
}
