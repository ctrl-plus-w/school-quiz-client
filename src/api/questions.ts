import { AxiosError } from 'axios';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

const DEFAULT_API_ERROR_RESPONSE: APIResponse<null> = [null, { status: 400, message: 'Une erreur est survenue ' }];

export const getQuestions = async (quizId: number, token: string): Promise<APIResponse<Array<Question>>> => {
  try {
    const { data: questions } = await database.get(`/api/quizzes/${quizId}/questions`, getHeaders(token));

    return [questions, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const getQuestion = async (quizId: number, questionId: number, token: string): Promise<APIResponse<Question>> => {
  try {
    const { data: question } = await database.get(`/api/quizzes/${quizId}/questions/${questionId}`, getHeaders(token));

    return [question, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 404) return [null, { status: 404, message: "Cette question n'existe pas." }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const getStudentQuestion = async (token: string): Promise<APIResponse<Question>> => {
  try {
    const { data: question } = await database.get(`/api/events/event/question`, getHeaders(token));

    return [question, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 404) return [null, { status: 404, message: "Cette question n'existe pas." }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const getSpecifications = async (token: string): Promise<APIResponse<Array<IQuestionSpecification>>> => {
  try {
    const { data: questionSpecifications } = await database.get(`/api/questionSpecifications`, getHeaders(token));

    return [questionSpecifications, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

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

export const updateQuestion =
  <T>() =>
  async (quizId: number, questionId: number, updateAttributes: AllOptional<T>, token: string): Promise<APIResponse<UpdateResponse>> => {
    try {
      const { data: question } = await database.put(`/api/quizzes/${quizId}/questions/${questionId}`, updateAttributes, getHeaders(token));

      return [question, undefined];
    } catch (_err) {
      const err = _err as AxiosError;

      if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

      if (err.response.status === 403) return [null, { status: 403, message: '' }];
      if (err.response.status === 409) return [null, { status: 409, message: 'Cete question existe déja.' }];

      return DEFAULT_API_ERROR_RESPONSE;
    }
  };

export const createTextualQuestion = createQuestion<TextualQuestionCreationAttributes>('textualQuestion');
export const updateTextualQuestion = updateQuestion<AllOptional<TextualQuestionCreationAttributes>>();

export const createNumericQuestion = createQuestion<NumericQuestionCreationAttributes>('numericQuestion');
export const updateNumericQuestion = updateQuestion<AllOptional<NumericQuestionCreationAttributes>>();

export const createChoiceQuestion = createQuestion<ChoiceQuestionCreationAttributes>('choiceQuestion');
export const updateChoiceQuestion = updateQuestion<AllOptional<ChoiceQuestionCreationAttributes>>();

export const addChoices = async (
  quizId: number,
  questionId: number,
  choices: Array<EditableInputValue>,
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

export const removeChoices = async (
  quizId: number,
  questionId: number,
  choicesId: Array<number>,
  token: string
): Promise<APIResponse<DeleteResponse>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/choices`;

    for (const choiceId of choicesId) {
      await database.delete(`${endpoint}/${choiceId}`, getHeaders(token));
    }

    return [{ deleted: true }, undefined];
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
): Promise<APIResponse<Array<Answer>>> => {
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

export const removeExactAnswers = async (
  quizId: number,
  questionId: number,
  answersId: Array<number>,
  token: string
): Promise<APIResponse<DeleteResponse>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers`;

    for (const answerId of answersId) {
      await database.delete(`${endpoint}/${answerId}`, getHeaders(token));
    }

    return [{ deleted: true }, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];
    if (err.response.status === 409) return [null, { status: 409, message: 'Un des choix existe déja.' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const clearAnswers = async (quizId: number, questionId: number, token: string): Promise<APIResponse<DeleteResponse>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers`;

    await database.delete(endpoint, getHeaders(token));

    return [{ deleted: true }, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const addComparisonAnswer = async (
  quizId: number,
  questionId: number,
  answer: ComparisonAnswerCreationAttributes,
  token: string
): Promise<APIResponse<Answer>> => {
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

export const updateComparisonAnswer = async (
  quizId: number,
  questionId: number,
  answerId: number,
  updateAttributes: AllOptional<ComparisonAnswerCreationAttributes>,
  token: string
): Promise<APIResponse<UpdateResponse>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers/${answerId}`;
    await database.put(endpoint, updateAttributes, getHeaders(token));

    return [{ updated: true }, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};

export const answerQuestion = async (
  quizId: number,
  questionId: number,
  answerOrAnswers: { answer: string } | { answers: Array<string> },
  token: string
): Promise<APIResponse<IUserAnswer | Array<IUserAnswer>>> => {
  try {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/userAnswers`;

    const { data: createdAnswerOrAnswers } = await database.post(endpoint, answerOrAnswers, getHeaders(token));

    return [createdAnswerOrAnswers, undefined];
  } catch (_err) {
    const err = _err as AxiosError;

    if (!err.response) return DEFAULT_API_ERROR_RESPONSE;

    if (err.response.status === 403) return [null, { status: 403, message: '' }];

    return DEFAULT_API_ERROR_RESPONSE;
  }
};
