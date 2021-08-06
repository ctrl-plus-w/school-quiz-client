export const areArraysEquals = (arr: Array<any>, arr1: Array<any>, sortFunction?: (a: any, b: any) => number): boolean => {
  return JSON.stringify(arr.sort(sortFunction)) === JSON.stringify(arr1.sort(sortFunction));
};
