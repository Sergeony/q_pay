import { createSlice } from '@reduxjs/toolkit';

interface AdminProps {
    email: string | null;
    traderId: number | null;
}

const initialState: AdminProps = {
  email: null,
  traderId: null,
};

export const adminSlice = createSlice({
  name: 'adminSlice',
  initialState,
  reducers: {
    setTraderData: (state, action) => {
      state.email = action.payload.email;
      state.traderId = action.payload.traderId;
    },
  },
});

export const { setTraderData } = adminSlice.actions;

export default adminSlice.reducer;
