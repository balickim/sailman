import axios from 'axios';
import { toast } from 'react-toastify';

class ApiClient {
  config: Record<string, any> = {};
  cancel: () => true;
  _requestOptions: Record<string, any>;
  _requests: Record<string, any> = {};

  constructor(options?: Record<string, any>) {
    axios.interceptors.response.use(response => response, this.errorHandlerFactory());
    this.config = { ...this.config, ...options };
    this.cancel = () => true;
    this._requestOptions = { silent: false };
    this._requests = {};
  }

  request(params: Record<string, any>, options: Record<string, any> = {}): Promise<any> {
    const payload: Record<string, any> = {
      ...params,
      ...(params.url ? { url: params.url } : { url: params.path }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...params.headers,
      },
    };

    this._requestOptions = { silent: false, ...options };

    const hash = JSON.stringify(payload);

    if (!this._requests[hash]) {
      this._requests[hash] = axios(payload).catch(err => {
        console.error(err);
      });

      this._requests[hash].finally((response: Record<string, any>) => {
        delete this._requests[hash];
        return response;
      });
    }

    return this._requests[hash];
  }

  errorHandlerFactory() {
    return (error: Record<string, any>) => {
      if (axios.isCancel(error)) {
        return Promise.reject({ message: 'Request canceled' });
      } else {
        if (error?.response?.status === 401) {
          this.request({
            method: 'GET',
            path: `${process.env.NEXT_PUBLIC_AUTH_API}/auth/logout`,
          });
        }
        const errorMessages = this.getErrorsMessagesFromRequest(error);

        !this._requestOptions.silent &&
          errorMessages.forEach((error: string) => toast.error(error));
      }

      return Promise.reject(error);
    };
  }

  getErrorsMessagesFromRequest = (error: Record<string, any>) => {
    const generalErrorCode = error?.response?.data?.code;
    const errorMessages = [];

    if (generalErrorCode === 'VALIDATION_ERROR') {
      error.response?.data?.errors?.map(field => errorMessages.push(field));
    } else if (error.response.data.errors) {
      error.response?.data?.errors?.map(field => errorMessages.push(field));
    } else if (error?.response?.data && typeof error.response.data === 'string') {
      if (error.response.status >= 500 && error.response.status < 600) {
        errorMessages.push(error.response.status);
      } else {
        errorMessages.push(error.response.data);
      }
    }

    !errorMessages.length && errorMessages.push('Internal Server Error');

    return errorMessages;
  };
}

export default new ApiClient();
