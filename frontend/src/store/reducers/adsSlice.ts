import {createSlice} from '@reduxjs/toolkit';
import {BankProps} from "./banksSlice";


export interface BriefBankDetailsProps {
    id: number;
    title: string;
    last_four_card_number: number;
    bank: BankProps,
    use_automation: boolean;
}

export interface AdProps {
  id: number;
  bank_details: BriefBankDetailsProps[],
  bank: BankProps;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface CreateAdProps {
  bank_details_id: number;
}

export interface ToggleAdActivityProps {
  id: number;
  is_active: boolean;
}


interface stateProps {
  ads: AdProps[];
  loading: boolean;
  error: string;
}

const initialState: stateProps = {
  ads: [],
  loading: false,
  error: '',
}

export const adsSlice = createSlice({
  name: 'ads',
  initialState,
  reducers: {
    setAds: (state, action) => {
      state.ads = action.payload;
    }
  },
});


export const { setAds } = adsSlice.actions;
export default adsSlice.reducer;
