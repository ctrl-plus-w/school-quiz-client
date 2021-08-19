type QuizCreationAttributes = {
  title: string;
  description: string;
  strict: boolean;
  shuffle: boolean;
};

type EventCreationAttributes = {
  start: Date;
  end: Date;
  countdown: number;
  groupId: number;
  quizId: number;
};

type QuestionCreationAttributes = {
  title: string;
  description: string;
};

type TextualQuestionCreationAttributes = QuestionCreationAttributes & {
  accentSensitive: boolean;
  caseSensitive: boolean;

  verificationTypeSlug: VerificationType;
};

type NumericQuestionCreationAttributes = QuestionCreationAttributes & {
  questionSpecificationSlug: string;
};

type ChoiceQuestionCreationAttributes = QuestionCreationAttributes & {
  shuffle: boolean;

  questionSpecificationSlug: string;
};

type ChoiceCreationAttributes = {
  valid: boolean;
  name: string;
};

type ExactAnswerCreationAttributes = {
  answerContent: string;
};

type ComparisonAnswerCreationAttributes = {
  greaterThan: number;
  lowerThan: number;
};

type APIResponse<T> = [T | null, { status: number; message: string } | undefined];

type UpdateResponse = { updated: boolean };

type DeleteResponse = { deleted: boolean };

type RemoveResponse = { removed: boolean };
