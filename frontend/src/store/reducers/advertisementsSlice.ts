import {createSlice} from '@reduxjs/toolkit';


export interface advertisementsProps {
  id: number;
  trader_usdt_rate: number;
  exchange_usdt_rate: number;
  requisites: {
    id: number;
    title: string;
    last_four_card_number: number;
    bank: {
      id: number;
      title: string;
      icon_url: string;
    },
    automation_used: boolean;
  },
  created_at: Date;
  is_activated: boolean;
}

export interface createAdvertisementsProps {
  requisites_id: number;
}

interface stateProps {
  advertisements: advertisementsProps[];
  loading: boolean;
  error: string;
}

const initialState: stateProps = {
  advertisements: [],
  loading: false,
  error: '',
}

export const advertisementsSlice = createSlice({
  name: 'advertisements',
  initialState,
  reducers: {
    setAdvertisements: (state, action) => {
      state.advertisements = action.payload;
    }
  },
});


export const { setAdvertisements } = advertisementsSlice.actions;
export default advertisementsSlice.reducer;
