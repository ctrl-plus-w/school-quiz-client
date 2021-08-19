import type { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

const DEFAULT_API_ERROR_RESPONSE: APIResponse<null> = [null, { status: 400, message: 'Une erreur est survenue ' }];

export const getGroups = async (token: string): Promise<APIResponse<Array<IGroup>>> => {
  try {
    const { data: groups } = await database.get('/api/groups', getHeaders(token));

    return [groups, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};
