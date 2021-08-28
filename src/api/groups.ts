import { getApiCall } from '@api/index';

export const getGroups = async (token: string): Promise<APIResponse<Array<IGroup>>> => {
  const endpoint = '/api/groups';
  return getApiCall(endpoint, token);
};
