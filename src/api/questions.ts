import { deleteApiCall, getApiCall, postApiCall, updateApiCall } from '@api/index';

export const getQuestions = async (quizId: number, token: string): Promise<APIResponse<Array<Question>>> => {
  const endpoint = `/api/quizzes/${quizId}/questions`;
  return getApiCall(endpoint, token);
};

export const getQuestion = async (quizId: number, questionId: number, token: string): Promise<APIResponse<Question>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}`;
  return getApiCall(endpoint, token, { errors: { '404': "Cette question n'existe pas." } });
};

export const getStudentQuestion = async (token: string): Promise<APIResponse<Question>> => {
  const endpoint = `/api/events/event/question`;
  return getApiCall(endpoint, token, { errors: { '404': "Cette question n'existe pas." } });
};

export const getSpecifications = async (token: string): Promise<APIResponse<Array<IQuestionSpecification>>> => {
  const endpoint = `/api/questionSpecifications`;
  return getApiCall(endpoint, token);
};

export const createQuestion = <T>(questionType: QuestionType) => {
  return async <K>(quizId: number, creationAttributes: T, token: string): Promise<APIResponse<K>> => {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionType}`;
    return postApiCall(endpoint, token, { data: creationAttributes, errors: { 409: 'Cette question existe déjà.' } });
  };
};

export const updateQuestion =
  <T>() =>
  async (quizId: number, questionId: number, updateAttributes: AllOptional<T>, token: string): Promise<APIResponse<UpdateResponse>> => {
    const endpoint = `/api/quizzes/${quizId}/questions/${questionId}`;
    return updateApiCall(endpoint, token, { data: updateAttributes, errors: { '403': 'Cette question existe déjà.' } });
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
  const creationAttributes: Array<ChoiceCreationAttributes> = choices.map(({ checked, name }) => ({ valid: checked, name }));

  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/choices`;
  return postApiCall(endpoint, token, { data: creationAttributes, errors: { 409: 'Un des choix existe déjà.' } });
};

export const removeChoices = async (
  quizId: number,
  questionId: number,
  choicesId: Array<number>,
  token: string
): Promise<APIResponse<DeleteResponse>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/choices`;
  return deleteApiCall(endpoint, token, { data: choicesId, errors: { '409': 'Un des choix existe déjà.' } });
};

export const addExactAnswers = async (
  quizId: number,
  questionId: number,
  answers: Array<ExactAnswerCreationAttributes>,
  token: string
): Promise<APIResponse<Array<Answer>>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers/exact`;
  return postApiCall(endpoint, token, { data: answers });
};

export const removeExactAnswers = async (
  quizId: number,
  questionId: number,
  answersId: Array<number>,
  token: string
): Promise<APIResponse<DeleteResponse>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers`;
  return deleteApiCall(endpoint, token, { data: answersId });
};

export const clearAnswers = async (quizId: number, questionId: number, token: string): Promise<APIResponse<DeleteResponse>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers`;
  return deleteApiCall(endpoint, token);
};

export const addComparisonAnswer = async (
  quizId: number,
  questionId: number,
  answer: ComparisonAnswerCreationAttributes,
  token: string
): Promise<APIResponse<Answer>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers/comparison`;
  return postApiCall(endpoint, token, { data: answer, errors: { '409': 'Un des choix existe déja.' } });
};

export const updateComparisonAnswer = async (
  quizId: number,
  questionId: number,
  answerId: number,
  updateAttributes: AllOptional<ComparisonAnswerCreationAttributes>,
  token: string
): Promise<APIResponse<UpdateResponse>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/answers/${answerId}`;
  return updateApiCall(endpoint, token, { data: updateAttributes });
};

export const answerQuestion = async (
  quizId: number,
  questionId: number,
  answerOrAnswers: { answer: string } | { answers: Array<string> },
  token: string
): Promise<APIResponse<IUserAnswer | Array<IUserAnswer>>> => {
  const endpoint = `/api/quizzes/${quizId}/questions/${questionId}/userAnswers`;
  return postApiCall(endpoint, token, { data: answerOrAnswers });
};
