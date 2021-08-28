import type { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import API from '@constant/api';

import { METHODS, ERRORS } from '@constant/api';

export const handleApiCallError = <T>(err: AxiosError, errors?: { [K in ERRORS]?: string }): APIResponse<T> => {
  const DEFAULT_ERROR: APIResponse<undefined> = [undefined, { status: 400, message: errors?.[400] || API.DEFAULT_ERROR }];

  if (!err.response) return DEFAULT_ERROR;

  if (err.response.status in ERRORS) {
    const status = err.response.status as ERRORS;
    return [undefined, { status: status, message: errors?.[400] || API.DEFAULT_FORBIDDEN_ERROR }];
  }

  return DEFAULT_ERROR;
};

export const getApiCall = async <T>(endpoint: string, token: string, config?: { errors?: { [K in ERRORS]?: string } }): Promise<APIResponse<T>> => {
  return createApiCall<T, any>(endpoint, token, { method: METHODS.GET, errors: config?.errors });
};

export const postApiCall = async <T, CreationAttributesType>(
  endpoint: string,
  token: string,
  config: { errors?: { [K in ERRORS]?: string }; data: CreationAttributesType }
): Promise<APIResponse<T>> => {
  return createApiCall<T, CreationAttributesType>(endpoint, token, { method: METHODS.POST, errors: config?.errors, data: config.data });
};

export const updateApiCall = async <UpdateAttributesType>(
  endpoint: string,
  token: string,
  config: { errors?: { [K in ERRORS]?: string }; data: UpdateAttributesType }
): Promise<APIResponse<UpdateResponse>> => {
  return createApiCall<UpdateResponse, UpdateAttributesType>(endpoint, token, { method: METHODS.UPDATE, errors: config?.errors, data: config.data });
};

export const deleteApiCall = async (
  endpoint: string,
  token: string,
  config?: { errors?: { [K in ERRORS]?: string }; data?: number | Array<number> }
): Promise<APIResponse<DeleteResponse>> => {
  try {
    if (config?.data) {
      const ids = Array.isArray(config.data) ? config.data : [config.data];
      for (const id of ids) await database.delete(`${endpoint}/${id}`, getHeaders(token));
    } else {
      await database.delete(endpoint, getHeaders(token));
    }

    return [{ deleted: true }, undefined];
  } catch (_err) {
    const err = _err as AxiosError;
    return handleApiCallError(err, config?.errors);
  }
};

export const createApiCall = async <APIReponseType, AttributesType>(
  endpoint: string,
  token: string,
  config: {
    method: METHODS;
    errors?: { [K in ERRORS]?: string };
    data?: AttributesType;
    idOrIds?: number | Array<number>;
  }
): Promise<APIResponse<APIReponseType>> => {
  try {
    console.log(config.method);
    if (config.method === METHODS.GET) {
      const { data: responseData } = await database.get(endpoint, getHeaders(token));
      return [responseData, undefined];
    }

    if (config.method === METHODS.POST) {
      const { data: responseData } = await database.post(endpoint, config.data, getHeaders(token));
      return [responseData, undefined];
    }

    if (config.method === METHODS.UPDATE) {
      const { data: responseData } = await database.put(endpoint, config.data, getHeaders(token));
      return [responseData, undefined];
    }

    throw new Error();
  } catch (_err) {
    const err = _err as AxiosError;
    return handleApiCallError(err, config.errors);
  }
};
