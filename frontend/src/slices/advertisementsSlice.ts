import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { advertisementsService } from '../services/advertisementsService';

interface advertisementsProps {
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

interface stateProps {
  advertisements: advertisementsProps[] | null;
  loading: boolean;
  error: any;
}

const initialState: stateProps = {
  advertisements: null,
  loading: false,
  error: null,
}

export const advertisementsSlice = createSlice({
  name: 'advertisements',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAdvertisements: (state, action) => {
      state.advertisements = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});


// Async Thunk actions

export const fetchAdvertisements = createAsyncThunk(
  'advertisements/fetchAdvertisements',
  async (_, thunkAPI) => {
    try {
      const response = await advertisementsService.fetch();
      console.log(response.data)
      thunkAPI.dispatch(setAdvertisements(response.data));

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const { setLoading, setAdvertisements, setError } = advertisementsSlice.actions;
export default advertisementsSlice.reducer;
