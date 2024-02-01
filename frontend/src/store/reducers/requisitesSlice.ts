import { createSlice } from '@reduxjs/toolkit';

export interface RequisitesProps {
  id: number;
  title: string;
  card_number: number;
  cardholder_name: string;
  bank: {
    id: number;
    title: string;
    icon_url: string;
  },
  daily_limit: number;
  weekly_limit: number;
  monthly_limit: number;
  daily_turnover: number;
  weekly_turnover: number;
  monthly_turnover: number;
  automation_used: boolean;
  is_activated: boolean;
}


interface RequisitesState {
  requisites: RequisitesProps[];
  loading: boolean;
  error: string;
}

const initialState: RequisitesState = {
  requisites: [],
  loading: false,
  error: '',
};

export const requisitesSlice = createSlice({
  name: 'requisites',
  initialState,
  reducers: {
    setRequisites: (state, action) => {
      state.requisites = action.payload;
    },
  },
});

export const { setRequisites } = requisitesSlice.actions;
export default requisitesSlice.reducer;
