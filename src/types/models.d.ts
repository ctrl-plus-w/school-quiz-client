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
  role?: Role;
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

interface IEvent extends DefaultModelProperties {
  start: Date;
  end: Date;
  countdown: Date;

  owner?: IUser;
  collaborators?: Array<IUser>;
  quiz?: IQuiz;
  group?: IGroup;
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

type TypedQuestion = NumericQuestion | TextualQuestion | ChoiceQuestion;

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

  shuffle?: boolean;
};

interface IQuestion<T extends ITextualQuestion | INumericQuestion | IChoiceQuestion> extends DefaultModelProperties {
  title: string;
  slug: string;
  description: string;
  questionType: QuestionType;

  typedQuestion: T;

  answers: Array<IAnswer<IExactAnswer | IComparisonAnswer>>;
  userAnswers: Array<IUserAnswer>;
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
