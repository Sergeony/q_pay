import {BaseQueryFn, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {refreshToken} from "../utils";

export const hostUrl = 'http://localhost:8000'
// export const hostUrl = 'http://ec2-16-16-56-239.eu-north-1.compute.amazonaws.com'
const apiVersion = 'v1'
export const baseUrl = `${hostUrl}`

export const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('access');
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    //Language header (localization)
    // const language = localStorage.getItem("i18nextLng");
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
