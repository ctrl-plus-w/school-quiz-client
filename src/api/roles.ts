import { getApiCall } from '@api/index';

export const getRoles = async (token: string): Promise<APIResponse<Array<IRole>>> => {
  const endpoint = '/api/roles';
  return getApiCall(endpoint, token);
};
