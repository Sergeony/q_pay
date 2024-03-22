import { createSlice } from '@reduxjs/toolkit';

interface AdminProps {
    email: string | null;
    userId: number | null;
}

const initialState: AdminProps = {
  email: null,
  userId: null,
};

export const adminSlice = createSlice({
  name: 'adminSlice',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.email = action.payload.email;
      state.userId = action.payload.userId;
    },
  },
});

export const { setUserData } = adminSlice.actions;

export default adminSlice.reducer;
