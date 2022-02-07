import apiClient from './apiClient';
import { LoginDto, preResetPassword, preSignupDto, resetPassword, signupDto } from './auth.dtos';

class AuthResource {
  baseURL: string;

  constructor() {
    this.baseURL = `${process.env.NEXT_PUBLIC_API}/api/auth`;
  }

  get(endpoint: string): Promise<any> {
    return apiClient.request({
      method: 'GET',
      path: `${this.baseURL}/${endpoint}`,
    });
  }

  preSignup(data: preSignupDto): Promise<any> {
    return apiClient.request({
      method: 'POST',
      path: `${this.baseURL}/pre-signup`,
      data,
    });
  }

  signup(data: signupDto): Promise<any> {
    return apiClient.request({
      method: 'POST',
      path: `${this.baseURL}/signup`,
      data,
    });
  }

  login(data: LoginDto): Promise<any> {
    return apiClient.request({
      method: 'POST',
      path: `${this.baseURL}/login`,
      data,
    });
  }

  preResetPassword(data: preResetPassword): Promise<any> {
    return apiClient.request({
      method: 'PUT',
      path: `${this.baseURL}/pre-reset-password`,
      data,
    });
  }

  resetPassword(data: resetPassword): Promise<any> {
    return apiClient.request({
      method: 'PUT',
      path: `${this.baseURL}/reset-password`,
      data,
    });
  }
}

export default new AuthResource();

export const loginWithGoogle = user => {
  return fetch(`${process.env.NEXT_PUBLIC_API}/google-login`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(user),
  })
    .then(response => {
      return response.json();
    })
    .catch(err => console.error(err));
};
