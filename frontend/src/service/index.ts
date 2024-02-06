import {BaseQueryFn, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {jwtDecode} from "jwt-decode";
import {setUser} from "../store/reducers/authSlice";
import {authApi} from "./authService";

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
    localStorage.removeItem('access');
    const refreshResult = await baseQuery({
      url: '/auth/token/refresh/',
      method: 'POST',
      credentials: 'include',
    }, api, extraOptions);

    if ((refreshResult.data as RefreshResponse).access) {
      const token = (refreshResult.data as RefreshResponse).access;
      localStorage.setItem('access', token);
      const decodedToken: DecodedToken = jwtDecode(token);
      api.dispatch(setUser({ userType: decodedToken.user_type }));
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
