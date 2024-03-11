import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
// import { refreshToken } from "shared/lib/_utils/utils";

function toCamelCase(str: string): string {
    return str.replace(
        /([-_][a-z])/g,
        (group) => group
            .toUpperCase()
            .replace("-", "")
            .replace("_", "")
    );
}

function toSnakeCase(str: string): string {
    return str.replace(
        /[A-Z]/g,
        (letter) => `_${letter.toLowerCase()}`
    );
}

const deepTransformKeys = (obj: any, transformFunc: (key: string) => string): any => {
    if (Array.isArray(obj)) {
        return obj.map((value) => deepTransformKeys(value, transformFunc));
    }
    if (typeof obj === "object" && obj !== null) {
        return Object.keys(obj).reduce((acc, current) => {
            const newKey = transformFunc(current);
            acc[newKey] = deepTransformKeys(obj[current], transformFunc);
            return acc;
        }, {} as Record<string, any>);
    }
    return obj;
};

export const baseQuery = fetchBaseQuery({
    baseUrl: __API_URL__,
    prepareHeaders: (headers) => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        if (accessToken) {
            headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return headers;
    },
});

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
    if (args.body) {
        args.body = deepTransformKeys(args.body, toSnakeCase);
    }

    // Вызываем базовый запрос
    const result = await baseQuery(args, api, extraOptions);

    // Если есть данные в ответе, преобразуем их в camelCase
    if (result.data) {
        result.data = deepTransformKeys(result.data, toCamelCase);
    }

    return result;
};

// Language header (localization)
// const language = sessionStorage.getItem("i18nextLng");
// if (language) {
//   headers.set("Accept-Language", language);
// }

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
    baseQuery: customBaseQuery,
    tagTypes: ["Ads", "Trader", "Merchant", "Banks", "BankDetails", "Deposit", "Withdrawal"],
    endpoints: () => ({}),
});
