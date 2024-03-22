import { api } from "shared/api/api";

interface SignUpRequest {
    email: string;
    password: string;
    inviteCode: string;
    tgUsername?: string;
}

interface VerifyEmailRequest {
    email: string;
    evc: string;
}
interface VerifyEmailResponse {
    data: {
        tt: string;
        totpBase32: string; // TODO: Rename all the occurrences to totpSecret
    }
}
interface ResendEvcRequest {
    email: string;
}

interface VerifyTotpRequest {
    totp: string;
    tt: string;
}
interface VerifyTotpResponse {
    data: {
        access: string;
    }
}

interface SignInRequest {
    email: string;
    password: string;
}
interface SignInResponse {
    data: {
        tt: string;
    }
}

const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<void, SignUpRequest>({
            query: (data) => ({
                url: "/auth/sign-up/",
                method: "POST",
                body: data,
            }),
        }),
        verifyEmail: builder.mutation<VerifyEmailResponse, VerifyEmailRequest>({
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
                body: { totp: data.totp },
                credentials: "include",
                headers: data.tt && {
                    Authorization: `Bearer ${data.tt}`,
                },
            }),
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
    }),
});

export const {
    useSignUpMutation,
    useSignInMutation,
    useVerifyEmailMutation,
    useResendEvcMutation,
    useVerifyTotpMutation,
} = authApi;
