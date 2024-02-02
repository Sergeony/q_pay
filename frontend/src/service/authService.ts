import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {setUser} from "../store/reducers/authSlice";
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
  user_id: number;
  otp_base32?: string;
}

interface VerifyOtpParams {
  user_id: number;
  otp: string;
}

interface VerifyOtpResponseParams {
  access: string;
  refresh: string;
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
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
          dispatch(setUser({ userId: data.user_id, otpBase32: data.otp_base32 }));
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
          localStorage.setItem('refreshToken', data.refresh);
          localStorage.setItem('accessToken', data.access);
          const decodedToken: {user_type: number} = jwtDecode(data.access);
          dispatch(setUser({ userType: decodedToken.user_type }));
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
