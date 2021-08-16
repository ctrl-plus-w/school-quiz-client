import { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

const DEFAULT_API_ERROR_RESPONSE: APIResponse<null> = [null, { status: 400, message: 'Une erreur est survenue ' }];

export const createQuiz = async (creationAttributes: QuizCreationAttributes, token: string): Promise<APIResponse<IQuiz>> => {
  try {
    const { data: quiz } = await database.post('/api/quizzes', creationAttributes, getHeaders(token));

    return [quiz, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Ce quiz existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const updateQuiz = async (
  quizId: number,
  updateAttributes: AllOptional<QuizCreationAttributes>,
  token: string
): Promise<APIResponse<IQuiz>> => {
  try {
    const { data: quiz } = await database.put(`/api/quizzes/${quizId}`, updateAttributes, getHeaders(token));

    return [quiz, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Ce quiz existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const addCollaborators = async (quizId: number, userIds: Array<number>, token: string): Promise<APIResponse<UpdateResponse>> => {
  try {
    const { data: updated } = await database.post(`/api/quizzes/${quizId}/collaborators`, { userIds }, getHeaders(token));

    return [updated, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des collaborateurs existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const removeCollaborators = async (quizId: number, userIds: Array<number>, token: string): Promise<APIResponse<RemoveResponse>> => {
  try {
    for (const userId of userIds) {
      await database.delete(`/api/quizzes/${quizId}/collaborators/${userId}`, getHeaders(token));
    }

    return [{ removed: true }, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des collaborateurs existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};
