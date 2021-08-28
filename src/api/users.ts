import { getApiCall } from '@api/index';

export const getUsers = async (token: string, role?: 'professeur' | 'admin' | 'eleve'): Promise<APIResponse<Array<IUser>>> => {
  const endpoint = role ? `/api/users?role=${role}&self=false` : '/api/users';
  return getApiCall(endpoint, token);
};
