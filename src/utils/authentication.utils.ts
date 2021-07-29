import { AxiosRequestConfig } from 'axios';

export const getHeaders = (token: string): AxiosRequestConfig => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
