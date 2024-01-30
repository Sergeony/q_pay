import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../slices/userSlice";
import themeReducer from "../slices/themeSlice";


const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
