import {Action, createSlice, PayloadAction, ThunkAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {AppThunk, RootState} from "../store/store";

interface ThemeState {
  theme: 'light' | 'dark';
}

export interface AppState {
  theme: ThemeState;
}

const initialState: ThemeState = {
  theme: 'light', // начальное значение
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const toggleTheme = (): ThunkAction<void, AppState, null, Action<string>> => async (dispatch, getState) => {
  const currentTheme = getState().theme.theme;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';

  dispatch(setTheme(newTheme));

  try {
    // Замените URL на адрес вашего API
    const response = await axios.post('/api/theme', { theme: newTheme });
    console.log('Тема изменена:', response.data);
  } catch (error: any) {
    console.error('Ошибка при изменении темы:', error.message);
  }
};

export const selectTheme = (state: RootState) => state.theme.theme;

export default themeSlice.reducer;
