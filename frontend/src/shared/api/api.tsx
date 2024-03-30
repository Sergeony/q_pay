import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { transformKeyFormat } from "shared/lib/utils/utils";

export const baseQuery = fetchBaseQuery({
    baseUrl: __API_URL__,
    prepareHeaders: (headers) => {
        const access = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        if (access) {
            headers.set("Authorization", `Bearer ${access}`);
        }
        return headers;
    },
});

export const refreshToken = async () => fetch(`${__API_URL__}/auth/token/refresh/`, {
    method: "POST",
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
    },
})
    .then(async (response) => {
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, data.access);
            return response;
        }
        localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        location.reload();
        return null;
    })
    .catch(() => {
        // TODO: add handling
    });

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
    if (args.body) {
        args.body = transformKeyFormat(args.body, "snake");
    }
    let response = await baseQuery(args, api, extraOptions);
    if (response.error?.status === 401) {
        const refreshTokenResponse = await refreshToken();
        if (refreshTokenResponse?.ok) {
            response = await baseQuery(args, api, extraOptions);
        }
    }
    if (response.data) {
        response.data = transformKeyFormat(response.data, "camel");
    }
    return response;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: customBaseQuery,
    tagTypes: ["Ads", "Trader", "Merchant", "Banks", "BankDetails", "Deposit", "Withdrawal"],
    endpoints: () => ({}),
});
