import { isNotNull } from './mapper.utils';

export const getLength = (obj: { [key: string]: unknown }): number => {
  return Object.values(obj).filter(isNotNull).length;
};
