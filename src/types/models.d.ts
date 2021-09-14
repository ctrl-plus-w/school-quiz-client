interface DefaultModelProperties {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IUser extends DefaultModelProperties {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  gender: boolean | null;
  groups: Array<IGroup>;
  role?: IRole;
  state?: IState;
  eventWarns?: Array<IWarn>;
  analytics: Array<IAnalytic>;
}

interface IUserCreationAttributes {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  gender?: boolean;
}

interface IAnalytic extends DefaultModelProperties {
  startedAt: Date;
  endedAt: Date;
  score: number;
  maxScore: number;
}

interface IGroup extends DefaultModelProperties {
  name: string;
  slug: string;
  labels: Array<Label>;
}

interface ILabel extends DefaultModelProperties {
  name: string;
  slug: string;
}

interface IVerificationType extends DefaultModelProperties {
  name: string;
  slug: string;
}

interface IQuestionSpecification extends DefaultModelProperties {
  name: string;
  slug: string;
  questionType: QuestionType;
}

interface IState extends DefaultModelProperties {
  name: string;
  slug: string;
}

interface IRole extends DefaultModelProperties {
  name: string;
  slug: string;
  permission: number;
}

interface IWarn {
  amount: number;
}

interface IEvent extends DefaultModelProperties {
  start: string;
  end: string;
  countdown: string;

  owner: IUser;
  collaborators: Array<IUser>;
  quiz?: IQuiz;
  group?: IGroup;
  users?: Array<IUser>;
  analytics?: Array<IAnalytic>;

  blocked?: boolean;
  remainingQuestions?: number;
  answeredQuestions?: number;
  inFuture?: boolean;

  started?: boolean;
  startedAt?: Date;
}

interface IQuiz extends DefaultModelProperties {
  title: string;
  slug: string;
  description: string;
  strict: boolean;
  shuffle: boolean;
  questions: Array<Question>;
  owner: IUser;
  collaborators: Array<IUser>;
}

type TypedAnswer = IExactAnswer | IComparisonAnswer;

type AnswerType = 'exactAnswer' | 'comparisonAnswer';

type Answer = DefaultModelProperties & {
  typedAnswer?: IExactAnswer | IComparisonAnswer;
  answerType: AnswerType;
};

interface IAnswer<T extends IExactAnswer | IComparisonAnswer> extends DefaultModelProperties {
  typedAnswer: T;
  answerType: AnswerType;
}

interface IExactAnswer extends DefaultModelProperties {
  answerContent: string;

  answer?: Answer;
}

interface IComparisonAnswer extends DefaultModelProperties {
  lowerThan: number;
  greaterThan: number;

  answer?: Answer;
}

type TypedQuestion = INumericQuestion | ITextualQuestion | IChoiceQuestion;

type VerificationType = 'hybride' | 'automatique' | 'manuel';
type QuestionType = 'numericQuestion' | 'textualQuestion' | 'choiceQuestion';

type Question = DefaultModelProperties & {
  title: string;
  slug: string;
  description: string;
  questionType: QuestionType;

  typedQuestion?: TypedQuestion;

  answers: Array<IAnswer>;
  userAnswers: Array<IUserAnswer>;

  strict?: boolean;
  shuffle?: boolean;

  answeredQuestions?: number;
  remainingQuestions?: number;

  blocked?: boolean;
};

interface IQuestion<T extends ITextualQuestion | INumericQuestion | IChoiceQuestion> extends DefaultModelProperties {
  title: string;
  slug: string;
  description: string;
  questionType: QuestionType;

  typedQuestion: T;

  answers: Array<IAnswer<IExactAnswer | IComparisonAnswer>>;
  userAnswers: Array<IUserAnswer>;

  answeredQuestions?: number;
  remainingQuestions?: number;

  blocked?: boolean;
}

interface INumericQuestion extends IQuestion {
  questionSpecification?: IQuestionSpecification;
}

interface ITextualQuestion extends IQuestion {
  accentSensitive: boolean;
  caseSensitive: boolean;

  verificationType?: IVerificationType;
}

interface IChoiceQuestion extends IQuestion {
  shuffle: boolean;

  choices: Array<IChoice>;

  questionSpecification?: IQuestionSpecification;
}

interface IChoice extends DefaultModelProperties {
  name: string;
  slug: string;

  valid: boolean;
}

interface IUserAnswer extends DefaultModelProperties {
  user?: IUser;
  question?: Question;
  answerContent: string;
}
