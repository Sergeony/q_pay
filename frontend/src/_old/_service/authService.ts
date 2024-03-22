import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQueryWithReauth, DecodedToken} from "./index";
import {setUser} from "_store/reducers/authSlice";
import {jwtDecode} from "jwt-decode";


interface RegisterUserParams {
  email: string;
  password: string;
  invite_code: string | null;
}

interface RegisterUserResponseParams {
  message: string;
}

interface LoginUserParams {
  email: string;
  password: string;
}

interface LoginUserResponseParams {
  otp_base32?: string;
}

interface VerifyOtpParams {
  email: string;
  password: string;
  otp: string;
}

interface VerifyOtpResponseParams {
  access: string;
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponseParams, RegisterUserParams>({
      query: (body) => ({
        url: 'auth/register/',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(setUser({ email: arg.email, password: arg.password }));
        } catch (error) {
          // Обработка ошибок
        }
      },
    }),
    loginUser: builder.mutation<LoginUserResponseParams, LoginUserParams>({
      query: (body) => ({
        url: 'auth/login/',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ email: arg.email, password: arg.password, otpBase32: data.otp_base32 }));
        } catch (error) {
          // Обработка ошибок
        }
      },
    }),
    verifyUserOtp: builder.mutation<VerifyOtpResponseParams, VerifyOtpParams>({
      query: (body) => ({
        url: 'auth/verify-otp/',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          sessionStorage.setItem('access', data.access);
          const decodedToken: DecodedToken = jwtDecode(data.access);
          dispatch(setUser({ userType: decodedToken.user_type, token: data.access }));
        } catch (error) {
          // Обработка ошибок
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useVerifyUserOtpMutation,
} = authApi;