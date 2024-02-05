import {createSlice} from '@reduxjs/toolkit';


interface userProps {
  userType: number;
  otpBase32: string;
  email: string;
  password: string;
  userId: number;
}

interface stateProps {
  auth: userProps;
  loading: boolean;
  error: string;
}

const initialState: stateProps = {
  auth: {
    userType: NaN,
    otpBase32: '',
    email: '',
    password: '',
    userId: NaN,
  },
  loading: false,
  error: '',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.auth = action.payload;
    },
  },
});


export const {setUser } = authSlice.actions;
export default authSlice.reducer;
