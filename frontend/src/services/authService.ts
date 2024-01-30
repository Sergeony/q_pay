import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

const register = (email: string, password: string, inviteCode: string) => {
  return axios.post(API_URL + 'register/', { email, password, invite_code: inviteCode });
};

const login = (email: string, password: string) => {
  return axios.post(API_URL + 'login/', { email, password });
};

const verifyOtp = (userId: number, otp: number) => {
  return axios.post(API_URL + 'verify-otp/', { user_id: userId, otp: otp });
};

export const authService = {
  register,
  login,
  verifyOtp,
};
