import { formatDateTime } from '@util/date.utils';

export const idNameSlugMapper = <T extends IBasicModel>(instance: T): IBasicModel => {
  return { id: instance.id, name: instance.name, slug: instance.slug };
};

export const nameSlugMapper = <T extends { name: string; slug: string }>(instance: T): IBasicModel => {
  return { name: instance.name, slug: instance.slug };
};

export const slugMapper = <T extends { slug: string }>(instance: T): string => {
  return instance.slug;
};

export const nameMapper = <T extends { name: string }>(instance: T): string => {
  return instance.name;
};

export const idMapper = <T extends { id: string }>(instance: T): string => {
  return instance.id;
};

export const stringifyGender = (gender: boolean | null): string => {
  if (gender === null) return 'undefined';
  return gender ? 'male' : 'female';
};

export const booleanMapper = (value: boolean): string => {
  return value ? 'Oui' : 'Non';
};

export const questionTypeMapper = (questionType: QuestionType): string => {
  if (questionType === 'textualQuestion') return 'Textuelle';
  if (questionType === 'choiceQuestion') return 'À choix';
  return 'Numérique';
};

export const questionTypeFilter =
  (questionType: QuestionType) =>
  (instance: IQuestionSpecification): boolean => {
    return instance.questionType === questionType;
  };

export const str = (val: RegExp | number | Date): string => {
  if (typeof val === 'number') return val.toString();
  if (val instanceof Date) return val.toISOString();

  return val.toString().slice(1, -1);
};

export const int = (val: string): number => {
  return parseInt(val);
};

export const parseExactAnswer = (answer: string, questionSpecificationSlug: string): string => {
  if (questionSpecificationSlug !== 'date') return answer;

  const [date, month, year] = answer.split('/').map(int);
  return new Date(year, month - 1, date).toISOString();
};

export const parseNumericAnswer = (answer: string, questionSpecificationSlug: string): number => {
  if (['nombre-entier', 'pourcentage', 'prix'].includes(questionSpecificationSlug)) return parseInt(answer);
  if (['nombre-decimal'].includes(questionSpecificationSlug)) return parseFloat(answer);

  if (['date'].includes(questionSpecificationSlug)) {
    const [day, month, year] = answer.split('/').map(int);
    return new Date(year, month - 1, day).valueOf();
  }

  return parseInt(answer);
};

export const isNull = (el: unknown): boolean => {
  return el === null || el === undefined;
};

export const isNotNull = (el: unknown): boolean => !isNull(el);

export const collaboratorsMapper = (user: IUser): IBasicModel => {
  return { name: `${user.firstName} ${user.lastName}`, slug: user.id.toString() };
};

export const formatNumber = (num: string | number): string => {
  if (typeof num === 'string') return parseInt(num) < 10 ? `0${Math.abs(parseInt(num))}` : `${num}`;
  return num < 10 ? `0${Math.abs(num)}` : `${num}`;
};

export const shuffle = <T>(arr: Array<T>): Array<T> => {
  return arr
    .map((value) => ({ value, _sort: Math.random() }))
    .sort((a, b) => a._sort - b._sort)
    .map(({ value }) => value);
};

export const sortById = <T extends { id: number }>(arr: Array<T>): Array<T> => {
  return [...arr].sort((a, b) => a.id - b.id);
};

export const genderMapper = (gender: boolean | null, slug = false): string => {
  switch (gender) {
    case true:
      return slug ? 'homme' : 'Homme';

    case false:
      return slug ? 'femme' : 'Femme';

    default:
      return slug ? 'indefini' : 'Indéfini';
  }
};

export const scoreMapper = (analytics?: Array<IAnalytic>): string => {
  if (analytics && analytics[0] && analytics[0].score !== 0) return str(analytics[0].score);
  return '-';
};

export const maxScoreMapper = (analytics?: Array<IAnalytic>): string => {
  if (analytics && analytics[0] && analytics[0].maxScore !== 0) return str(analytics[0].maxScore);
  return '-';
};

export const eventStartedAtMapper = (analytics?: Array<IAnalytic>): string => {
  if (analytics && analytics[0] && analytics[0].startedAt) return formatDateTime(analytics[0].startedAt);
  return '-';
};

export const eventEndedAtMapper = (analytics?: Array<IAnalytic>): string => {
  if (analytics && analytics[0] && analytics[0].endedAt) return formatDateTime(analytics[0].endedAt);
  return '-';
};
