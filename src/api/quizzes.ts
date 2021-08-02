import { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from 'database/database';

const DEFAULT_API_ERROR_RESPONSE: APIResponse = [false, { status: 400, message: 'Une erreur est survenue ' }];

export const createQuiz = async (creationAttributes: QuizCreationAttributes, token: string): Promise<APIResponse> => {
  try {
    await database.post('/api/quizzes', creationAttributes, getHeaders(token));

    return [true, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [false, { status: 403, message: '' }];
    if (err.response.status === 409) return [false, { status: 409, message: 'Ce quiz existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};
