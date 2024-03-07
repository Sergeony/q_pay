import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LOCAL_STORAGE_ACCESS_KEY } from "shared/const/localStorage";
// import { refreshToken } from "shared/lib/_utils/utils";

export const baseQuery = fetchBaseQuery({
    baseUrl: __API_URL__,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem(LOCAL_STORAGE_ACCESS_KEY);
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        // Language header (localization)
        // const language = sessionStorage.getItem("i18nextLng");
        // if (language) {
        //   headers.set("Accept-Language", language);
        // }

        return headers;
    },
});

// type BaseQueryWithReauth = BaseQueryFn<string | Parameters<typeof baseQuery>[0], unknown, unknown>;
//
// const baseQueryWithReauth: BaseQueryWithReauth = async (args, api, extraOptions) => {
//     let result = await baseQuery(args, api, extraOptions);
//     if (result.error && result.error.status === 401) {
//         const token = await refreshToken(api);
//         if (token) result = await baseQuery(args, api, extraOptions);
//     }
//     return result;
// };

export const api = createApi({
    reducerPath: "api",
    baseQuery,
    tagTypes: ["Ads", "Trader", "Merchant", "Banks", "BankDetails", "Deposit", "Withdrawal"],
    endpoints: () => ({}),
});
