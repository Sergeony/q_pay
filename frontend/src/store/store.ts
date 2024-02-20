import { configureStore } from '@reduxjs/toolkit';
// import { authApi, adsApi, banksApi, bankDetailsApi, exportApi, transactionsApi, adminApi, clientApi } from "../service";
import { themeReducer, authReducer, adminReducer, adsReducer, bankDetailsReducer, webSocketReducer, clientTransactionReducer, banksReducer, balanceReducer } from "./reducers";

import {authApi} from "../service/authService";
import {adsApi} from "../service/adsService";
import {banksApi} from "../service/banksService";
import {bankDetailsApi} from "../service/bankDetailsService";
import {exportApi} from "../service/exportService";
import {transactionsApi} from "../service/transactionsService";
import {adminApi} from "../service/adminService";
import {clientApi} from "../service/clientService.ts";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    balance: balanceReducer,
    webSocket: webSocketReducer,
    [authApi.reducerPath]: authApi.reducer,
    [banksApi.reducerPath]: banksApi.reducer,
    [bankDetailsApi.reducerPath]: bankDetailsApi.reducer,
    banks: banksReducer,
    bankDetails: bankDetailsReducer,
    advertisements: adsReducer,
    [adsApi.reducerPath]: adsApi.reducer,
    [exportApi.reducerPath]: exportApi.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [clientApi.reducerPath]: clientApi.reducer,
    admin: adminReducer,
    clientTransaction: clientTransactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(adsApi.middleware)
      .concat(banksApi.middleware)
      .concat(bankDetailsApi.middleware)
      .concat(exportApi.middleware)
      .concat(transactionsApi.middleware)
      .concat(adminApi.middleware)
      .concat(clientApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
