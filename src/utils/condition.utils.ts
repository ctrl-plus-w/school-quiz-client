export const areArraysEquals = (arr: Array<any>, arr1: Array<any>): boolean => {
  return JSON.stringify(arr) === JSON.stringify(arr1);
};
