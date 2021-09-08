import { deleteApiCall, getApiCall, postApiCall, updateApiCall } from '@api/index';

export const getQuizzes = async (token: string, userId?: number): Promise<APIResponse<Array<IQuiz>>> => {
  const endpoint = `/api/quizzes${userId ? `?userId=${userId}` : ''}`;
  return getApiCall(endpoint, token);
};

export const getQuiz = async (quizId: number, token: string, userId?: number): Promise<APIResponse<IQuiz>> => {
  const endpoint = userId ? `/api/users/${userId}/quizzes/${quizId}` : `/api/quizzes/${quizId}`;
  return getApiCall(endpoint, token, { errors: { '404': "Le quiz n'a pas été trouvé." } });
};

export const createQuiz = async (creationAttributes: QuizCreationAttributes, token: string): Promise<APIResponse<IQuiz>> => {
  const endpoint = '/api/quizzes';
  return postApiCall(endpoint, token, { data: creationAttributes, errors: { '409': 'Ce quiz existe déja.' } });
};

export const updateQuiz = async (
  quizId: number,
  updateAttributes: AllOptional<QuizCreationAttributes>,
  token: string
): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/quizzes/${quizId}`;
  return updateApiCall(endpoint, token, { data: updateAttributes, errors: { '409': 'Ce quiz existe déjà.' } });
};

export const addCollaborators = async (quizId: number, userIds: Array<number>, token: string): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/quizzes/${quizId}/collaborators`;
  return postApiCall(endpoint, token, { data: { userIds }, errors: { '409': 'Un des collaborateurs existe déjà.' } });
};

export const removeCollaborators = async (quizId: number, userIds: Array<number>, token: string): Promise<APIResponse<DeleteResponse>> => {
  const endpoint = `/api/quizzes/${quizId}/collaborators`;
  return deleteApiCall(endpoint, token, { data: userIds });
};
