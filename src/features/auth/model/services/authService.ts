import { api } from "shared/api/api";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { jwtDecode } from "jwt-decode";
import { userActions } from "entities/User";
import { DecodedTokenProps } from "../types/authSchema";

// =============================================

interface SignUpRequest {
    email: string;
    password: string;
    inviteCode: string;
    tgUsername?: string;
}

// =============================================

interface VerifyEvcRequest {
    email: string;
    evc: string; // Email Verification Code
}
interface VerifyEvcResponse {
    tt: string;
    totpBase32: string; // Ключ для настройки двухфакторной аутентификации
}

// =============================================

interface VerifyTotpRequest {
    totp: string;
    tt: string;
}
interface VerifyTotpResponse {
    accessToken: string;
}

// =============================================

interface SignInRequest {
    email: string;
    password: string;
}

// =============================================

interface ResendEvcRequest {
    email: string;
}

// =============================================

interface SignInResponse {
    tt: string;
}

// =============================================

interface RefreshTokenResponse {
    accessToken: string;
}
// =============================================

const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<void, SignUpRequest>({
            query: (data) => ({
                url: "/auth/sign-up/",
                method: "POST",
                body: data,
            }),
        }),
        verifyEvc: builder.mutation<VerifyEvcResponse, VerifyEvcRequest>({
            query: (data) => ({
                url: "/auth/verify-evc/",
                method: "POST",
                body: data,
            }),
        }),
        verifyTotp: builder.mutation<VerifyTotpResponse, VerifyTotpRequest>({
            query: (data) => ({
                url: "/auth/verify-totp/",
                method: "POST",
                body: data,
                headers: data.tt ? { Authorization: `Bearer ${data.tt}` } : {},
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data } = await queryFulfilled;
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, data.accessToken);
                    const decodedToken: DecodedTokenProps = jwtDecode(data.accessToken);
                    dispatch(userActions.setUser({
                        type: decodedToken.userType,
                        id: decodedToken.id,
                    }));
                } catch (error) {
                    // Обработка ошибок
                }
            },
        }),
        resendEvc: builder.mutation<void, ResendEvcRequest>({
            query: (data) => ({
                url: "/auth/resend-evc/",
                method: "POST",
                body: data, //  FIXME: get email from state instead of form
            }),
        }),
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (data) => ({
                url: "/auth/sign-in/",
                method: "POST",
                body: data,
            }),
        }),
        refreshToken: builder.mutation<RefreshTokenResponse, void>({
            query: () => ({
                url: "/auth/token/refresh/",
                method: "POST",
                credentials: "include",
            }),
            onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
                try {
                    localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
                    const { data } = await queryFulfilled;
                    localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, data.accessToken);
                } catch (error) {
                    console.log("COULDN'T REFRESH TOKEN");
                    dispatch(userActions.clearUser());
                }
            },
        }),
    }),
});

export const {
    useSignUpMutation,
    useSignInMutation,
    useVerifyEvcMutation,
    useResendEvcMutation,
    useVerifyTotpMutation,
    useRefreshTokenMutation,
} = authApi;
