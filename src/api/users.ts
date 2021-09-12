import { getApiCall } from '@api/index';

export const getUsers = async (token: string, role?: 'professeur' | 'admin' | 'eleve'): Promise<APIResponse<Array<IUser>>> => {
  const endpoint = role ? `/api/users?role=${role}&self=false` : '/api/users';
  return getApiCall(endpoint, token);
};

export const getUser = async (userId: number, token: string): Promise<APIResponse<IUser>> => {
  const endpoint = `/api/users/${userId}`;
  return getApiCall(endpoint, token, { errors: { '404': "L'utilisateur n'a pas été trouvé." } });
};
