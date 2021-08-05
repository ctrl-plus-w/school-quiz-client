import { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from 'database/database';

const DEFAULT_API_ERROR_RESPONSE: APIResponse<null> = [null, { status: 400, message: 'Une erreur est survenue ' }];

export const createQuestion = <T>(questionType: QuestionType) => {
  return async <K>(quizId: number, creationAttributes: T, token: string): Promise<APIResponse<K>> => {
    try {
      const { data: question } = await database.post(`/api/quizzes/${quizId}/questions/${questionType}`, creationAttributes, getHeaders(token));

      return [question, undefined];
    } catch (_err) {
      const err = _err as AxiosError;

      if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

      if (err.response.status === 403) return [null, { status: 403, message: '' }];
      if (err.response.status === 409) return [null, { status: 409, message: 'Cete question existe déja.' }];

      return DEFAULT_API_ERROR_RESPONSE;
    }
  };
};

export const createTextualQuestion = createQuestion<TextualQuestionCreationAttributes>('textualQuestion');

export const createNumericQuestion = createQuestion<NumericQuestionCreationAttributes>('numericQuestion');

export const createChoiceQuestion = createQuestion<ChoiceQuestionCreationAttributes>('choiceQuestion');

export const addChoices = async (
  quizId: number,
  questionId: number,
  choices: EditableInputValues,
  token: string
): Promise<APIResponse<Array<IChoice>>> => {
  try {
    const creationAttributes: Array<ChoiceCreationAttributes> = choices.map(({ checked, name }) => ({ valid: checked, name }));
    const { data: createdChoices } = await database.post(
      `/api/quizzes/${quizId}/questions/${questionId}/choices`,
      creationAttributes,
      getHeaders(token)
    );

    return [createdChoices, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des choix existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const addExactAnswers = async (
  quizId: number,
  questionId: number,
  answers: Array<ExactAnswerCreationAttributes>,
  token: string
): Promise<APIResponse<Array<IAnswer>>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers/exact`;
    const { data: createdAnswers } = await database.post(endpoint, answers, getHeaders(token));

    return [createdAnswers, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des choix existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const addComparisonAnswer = async (
  quizId: number,
  questionId: number,
  answer: ComparisonAnswerCreationAttributes,
  token: string
): Promise<APIResponse<IAnswer>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers/comparison`;
    const { data: createdAnswers } = await database.post(endpoint, answer, getHeaders(token));

    return [createdAnswers, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des choix existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};
