import { configureStore } from '@reduxjs/toolkit';
import themeReducer from "./reducers/themeSlice";
import {authApi} from "../service/authService";
import {advertisementsApi} from "../service/advertisementsService";
import authReducer from "../store/reducers/authSlice";
import advertisementsReducer from "../store/reducers/advertisementsSlice";
import {banksApi} from "../service/banksService";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [banksApi.reducerPath]: banksApi.reducer,
    advertisements: advertisementsReducer,
    [advertisementsApi.reducerPath]: advertisementsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(advertisementsApi.middleware)
      .concat(banksApi.middleware)
  ,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
