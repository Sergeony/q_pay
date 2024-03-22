// export * from "./adminService";
// export * from "./adsService";
// export * from "./authService";
// export * from "./bankDetailsService";
// export * from "./banksService";
// export * from "./clientService.ts";
// export * from "./clientWebSocketService";
// export * from "./exportService";
// export * from "./transactionsService";
// export * from "./webSocketService";
import {BaseQueryFn, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {refreshToken} from "../utils";

export const hostUrl = 'http://localhost:8000'
// export const hostUrl = 'http://ec2-16-16-56-239.eu-north-1.compute.amazonaws.com'
const apiVersion = 'v1'
export const baseUrl = `${hostUrl}`

export const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/`,
  prepareHeaders: (headers) => {
    const token = sessionStorage.getItem('access');
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    //Language header (localization)
    // const language = sessionStorage.getItem("i18nextLng");
    // if (language) {
    //   headers.set("Accept-Language", language);
    // }

    return headers;
  },
});


export type DecodedToken = {
  user_type: number;
};


interface RefreshResponse {
  access: string;
}

export const baseQueryWithReauth: BaseQueryFn<
  string | Parameters<typeof baseQuery>[0],
  unknown,
  unknown
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const token = await refreshToken(api);
    if (token)
      result = await baseQuery(args, api, extraOptions);
  }
  return result;
};
