export const generatePassword = (passwordLength: number): string => {
  const password = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return password.slice(0, passwordLength);
};

// min and max included
export const randomInt = (_min: number, _max: number): number => {
  const min = Math.ceil(_min);
  const max = Math.floor(_max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomSizeArray = <T>(min: number, max: number, content: T): Array<T> => {
  return new Array(randomInt(min, max)).fill(content);
};

export const generateArray = <T>(size: number, content: T): Array<T> => {
  return new Array(size).fill(content);
};
