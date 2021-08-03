export const idNameSlugMapper = <T extends IBasicModel>(instance: T): IBasicModel => {
  return { id: instance.id, name: instance.name, slug: instance.slug };
};

export const nameSlugMapper = <T extends IBasicModel>(instance: T): IBasicModel => {
  return { name: instance.name, slug: instance.slug };
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
