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
