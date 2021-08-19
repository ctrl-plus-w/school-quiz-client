export const areArraysEquals = (arr: Array<any>, arr1: Array<any>, sortFunction?: (a: any, b: any) => number): boolean => {
  return JSON.stringify(arr.sort(sortFunction)) === JSON.stringify(arr1.sort(sortFunction));
};

export const areDatesEquals = (date: Date, date1: Date): boolean => {
  return date.valueOf() === date1.valueOf();
};

export const isOneLoading = (arr: Array<'LOADING' | 'FULFILLED'>): boolean => {
  return arr.some((value) => value === 'LOADING');
};
