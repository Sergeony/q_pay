import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import registrationReducer from "../reducers/registrationReducer";
import themeReducer from "../reducers/setThemeReducer";

// Определите тип для RootState
export type RootState = ReturnType<typeof store.getState>;

// Создайте store
const store = configureStore({
  reducer: {
    registration: registrationReducer,
    theme: themeReducer,
  },
});

export default store;

// Определите типы для AppDispatch и AppThunk
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
