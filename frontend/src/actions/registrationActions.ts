import axios from 'axios';
import { Dispatch } from 'redux';
import {AppThunk} from "../store/store";

export const registerRequest = () => ({ type: 'REGISTER_REQUEST' });
export const registerSuccess = (userData: any) => ({ type: 'REGISTER_SUCCESS', payload: userData });
export const registerFailure = (error: string) => ({ type: 'REGISTER_FAILURE', payload: error });

export const registerUser = (userData: { email: string; password: string; confirmPassword: string }): AppThunk => async (dispatch: Dispatch) => {
  dispatch(registerRequest());
  try {
    // Замените URL на адрес вашего API
    const response = await axios.post('/api/register', userData);
    dispatch(registerSuccess(response.data));
  } catch (error: any) {
    dispatch(registerFailure(error.message));
  }
};
