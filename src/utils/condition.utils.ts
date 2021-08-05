export const areArraysEquals = (arr: Array<any>, arr1: Array<any>): boolean => {
  return JSON.stringify(arr.sort()) === JSON.stringify(arr1.sort());
};
