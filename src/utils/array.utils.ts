export const random = <T>(arr: Array<T>): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const sliceArray = <T>(arr: Array<T>, chunkSize: number): Array<Array<T>> => {
  const result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }

  return result;
};
