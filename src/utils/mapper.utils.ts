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

export const str = (val: RegExp): string => {
  return val.toString().slice(1, -1);
};

export const parseExactAnswer = (answer: string, questionSpecificationSlug: string): string => {
  if (questionSpecificationSlug !== 'date') return answer;

  const [year, month, date] = answer.split('/').map(parseInt);
  return new Date(year, month - 1, date).toISOString();
};

export const parseNumericAnswer = (answer: string, questionSpecificationSlug: string): number => {
  if (['nombre-entier', 'pourcentage', 'prix'].includes(questionSpecificationSlug)) return parseInt(answer);
  if (['nombre-decimal'].includes(questionSpecificationSlug)) return parseFloat(answer);

  if (['date'].includes(questionSpecificationSlug)) {
    const [day, month, year] = answer.split('/').map(parseInt);
    return new Date(year, month - 1, day).valueOf();
  }

  return parseInt(answer);
};
