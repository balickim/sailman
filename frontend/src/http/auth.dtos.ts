export interface preSignupDto {
  username: string;
  email: string;
  password: string;
  lang?: string;
}

export class signupDto {
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface preResetPassword {
  email: string;
  lang?: string;
}

export interface resetPassword {
  resetPasswordToken: string;
  newPassword: string;
}
