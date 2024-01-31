export {}

interface RegisterUserParams {
  email: string;
  password: string;
  inviteCode: string;
}


interface LoginUserParams {
  email: string;
  password: string;
}


interface VerifyOtpParams {
  userId: number;
  otp: string;
}


interface RegisterUserParams {
  email: string;
  password: string;
  inviteCode: string;
}

interface RegisterUserResponse {
  message: string;
}
