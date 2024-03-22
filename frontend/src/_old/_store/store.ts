import { configureStore } from '@reduxjs/toolkit';
// import { authApi, adsApi, banksApi, bankDetailsApi, exportApi, transactionsApi, adminApi, clientApi } from "../_service";
import { themeReducer, authReducer, adminReducer, adsReducer, bankDetailsReducer, webSocketReducer, clientTransactionReducer, banksReducer, balanceReducer } from "./reducers";

import {authApi} from "_service/authService";
import {adsApi} from "_service/adsService";
import {banksApi} from "_service/banksService";
import {bankDetailsApi} from "_service/bankDetailsService";
import {exportApi} from "_service/exportService";
import {transactionsApi} from "_service/transactionsService";
import {adminApi} from "_service/adminService";
import {clientApi} from "_service/clientService.ts.ts";

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
