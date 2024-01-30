import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { authService } from '../services/authService';

interface userProps {
  role: string;
}

interface stateProps {
  user: userProps | null;
  token: string | null;
  loading: boolean;
  error: any;
}

const initialState: stateProps = {
  user: null,
  token: null,
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
    setToken: (state, action) => {
      state.token = action.payload;
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
      return response.data; // Возвращаем данные пользователя
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


interface LoginUserParams {
  email: string;
  password: string;
  inviteCode: string;
}

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }: LoginUserParams, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      return response.data; // Возвращаем данные пользователя
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


interface VerifyOtpParams {
  userId: string;
  otp: string;
}

export const verifyUserOtp = createAsyncThunk(
  'user/verifyUserOtp',
  async ({ userId, otp }: VerifyOtpParams, thunkAPI) => {
    try {
      const response = await authService.verifyOtp(userId, otp);
      return response.data; // Возвращаем данные пользователя
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const { setLoading, setUser, setToken, setError } = userSlice.actions;
export default userSlice.reducer;