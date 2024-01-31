import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import {jwtDecode} from "jwt-decode";

interface userProps {
  userType: number;
  otpBase32: string;
  email: string;
  password: string;
  userId: number;
}

interface stateProps {
  user: userProps | null;
  loading: boolean;
  error: any;
}

const initialState: stateProps = {
  user: null,
  loading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});


// Async Thunk actions

interface RegisterUserParams {
  email: string;
  password: string;
  inviteCode: string;
}


export const registerUser = createAsyncThunk(
  'user/registerUser',
  async ({ email, password, inviteCode }: RegisterUserParams, thunkAPI) => {
    try {
      const response = await authService.register(email, password, inviteCode);
      thunkAPI.dispatch(setUser({
        email: email,
        password: password,
        // другие данные пользователя
      }));
      return response.data; // Возвращаем данные пользователя
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


interface LoginUserParams {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: LoginUserParams, thunkAPI) => {
    try {
      const response = await authService.login(email, password);

      thunkAPI.dispatch(setUser({
        userId: response.data.user_id,
        otpBase32: response.data.otp_base32,
      }));

      return response.data; // Возвращаем данные пользователя
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


interface VerifyOtpParams {
  userId: number;
  otp: string;
}

export const verifyUserOtp = createAsyncThunk(
  'user/verifyUserOtp',
  async ({ userId, otp }: VerifyOtpParams, thunkAPI) => {
    try {
      const response = await authService.verifyOtp(userId, otp);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('accessToken', response.data.access);

      const decodedToken: {user_type: number} = jwtDecode(response.data.access);
      thunkAPI.dispatch(setUser({
        userType: decodedToken.user_type
      }));

      return response.data; // Возвращаем данные пользователя
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const { setLoading, setUser, setError } = userSlice.actions;
export default userSlice.reducer;
