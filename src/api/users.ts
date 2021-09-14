import { getApiCall, postApiCall, updateApiCall } from '@api/index';

export const getUsers = async (token: string, role?: 'professeur' | 'admin' | 'eleve'): Promise<APIResponse<Array<IUser>>> => {
  const endpoint = role ? `/api/users?role=${role}&self=false` : '/api/users';
  return getApiCall(endpoint, token);
};

export const getUser = async (userId: number, token: string): Promise<APIResponse<IUser>> => {
  const endpoint = `/api/users/${userId}`;
  return getApiCall(endpoint, token, { errors: { '404': "L'utilisateur n'a pas été trouvé." } });
};

export const createUser = async (props: IUserCreationAttributes, token: string): Promise<APIResponse<IUser>> => {
  const endpoint = `/api/users`;
  return postApiCall(endpoint, token, { data: props });
};

export const updateUserRole = async (userId: number, roleId: number, token: string): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/users/${userId}/role`;
  return updateApiCall(endpoint, token, { data: { roleId } });
};

export const addUserGroups = async (userId: number, groupsId: number[], token: string): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/users/${userId}/groups`;
  return postApiCall(endpoint, token, { data: { groupIds: groupsId } });
};
