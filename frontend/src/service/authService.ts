import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {setUser} from "../store/reducers/authSlice";
import {jwtDecode} from "jwt-decode";


interface RegisterUserParams {
  email: string;
  password: string;
  inviteCode: string;
}


interface LoginUserParams {
  email: string;
  password: string;
}


interface VerifyOtpParams {
  userId: number;
  otp: string;
}


interface RegisterUserParams {
  email: string;
  password: string;
  inviteCode: string;
}

interface RegisterUserResponse {
  message: string;
}


export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (body) => ({
        url: 'auth/register/',
        method: 'POST',
        body
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser({ email: data.email, password: data.password }));
        } catch (error) {
          // Обработка ошибок
        }
      },
    }),
    loginUser: builder.mutation<any, LoginUserParams>({
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
    verifyUserOtp: builder.mutation({
      query: ({ userId, otp }) => ({
        url: 'auth/verify-otp/',
        method: 'POST',
        body: { user_id: userId, otp }
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
