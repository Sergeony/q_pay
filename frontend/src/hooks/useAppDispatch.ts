import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import {AppState} from "../reducers/setThemeReducer";

export type AppDispatch = ThunkDispatch<AppState, null, Action<string>>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
