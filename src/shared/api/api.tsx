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

        // Language header (localization)
        // const language = sessionStorage.getItem("i18nextLng");
        // if (language) {
        //   headers.set("Accept-Language", language);
        // }

        return headers;
    },
});

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
    if (args.body) {
        args.body = transformKeyFormat(args.body, "snake");
    }

    const result = await baseQuery(args, api, extraOptions);

    // if (result.error && result.error.status === 401) {
    //     const token = await refreshToken(api);
    //     if (token) {
    //         result = await baseQuery(args, api, extraOptions);
    //     }
    // }

    if (result.data) {
        result.data = transformKeyFormat(result.data, "camel");
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: customBaseQuery,
    tagTypes: ["Ads", "Trader", "Merchant", "Banks", "BankDetails", "Deposit", "Withdrawal"],
    endpoints: () => ({}),
});
