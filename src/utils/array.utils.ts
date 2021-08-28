/**
 * Get a random element in the array
 * @param arr The array to get an element from
 * @returns A array elementa
 */
export const random = <T>(arr: Array<T>): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Slice the array into chunks
 * @param arr The array to slice
 * @param chunkSize The size of the chunks
 * @returns An array of arrays
 */
export const sliceArray = <T>(arr: Array<T>, chunkSize: number): Array<Array<T>> => {
  const result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
};

/**
 * Check if the array has duplicated elements
 * @param arr The arrary
 * @returns A boolean
 */
export const hasDuplicatedElements = (arr: Array<unknown>): boolean => {
  return arr.length !== new Set(arr).size;
};
