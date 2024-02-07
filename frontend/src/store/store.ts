import { configureStore } from '@reduxjs/toolkit';
import themeReducer from "./reducers/themeSlice";
import {authApi} from "../service/authService";
import {advertisementsApi} from "../service/advertisementsService";
import authReducer from "../store/reducers/authSlice";
import adminReducer from "../store/reducers/adminSlice";
import advertisementsReducer from "../store/reducers/advertisementsSlice";
import requisitesReducer from "../store/reducers/requisitesSlice";
import webSocketReducer from "../store/reducers/webSocketSlice";
import {banksApi} from "../service/banksService";
import {requisitesApi} from "../service/requisitesService";
import {exportApi} from "../service/exportService";
import {transactionsApi} from "../service/transactionsService";
import {adminApi} from "../service/adminService";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    webSocket: webSocketReducer,
    [authApi.reducerPath]: authApi.reducer,
    [banksApi.reducerPath]: banksApi.reducer,
    [requisitesApi.reducerPath]: requisitesApi.reducer,
    requisites: requisitesReducer,
    advertisements: advertisementsReducer,
    [advertisementsApi.reducerPath]: advertisementsApi.reducer,
    [exportApi.reducerPath]: exportApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    admin: adminReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(advertisementsApi.middleware)
      .concat(banksApi.middleware)
      .concat(requisitesApi.middleware)
      .concat(exportApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(adminApi.middleware)
  ,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
