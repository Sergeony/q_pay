import { configureStore } from '@reduxjs/toolkit';
import themeReducer from "./reducers/themeSlice";
import {authApi} from "../service/authService";
import {advertisementsApi} from "../service/advertisementsService";
import authReducer from "../store/reducers/authSlice";
import advertisementsReducer from "../store/reducers/advertisementsSlice";
import requisitesReducer from "../store/reducers/requisitesSlice";
import {banksApi} from "../service/banksService";
import {requisitesApi} from "../service/requisitesService";
import {exportApi} from "../service/exportService";
import {transactionsApi} from "../service/transactionsService";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [banksApi.reducerPath]: banksApi.reducer,
    [requisitesApi.reducerPath]: requisitesApi.reducer,
    requisites: requisitesReducer,
    advertisements: advertisementsReducer,
    [advertisementsApi.reducerPath]: advertisementsApi.reducer,
    [exportApi.reducerPath]: exportApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
     getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(advertisementsApi.middleware)
      .concat(banksApi.middleware)
      .concat(requisitesApi.middleware)
      .concat(exportApi.middleware)
      .concat(transactionsApi.middleware)
  ,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
