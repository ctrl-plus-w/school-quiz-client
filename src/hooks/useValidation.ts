import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IReturnProperties {
  valid: boolean;
  setValid: Dispatch<SetStateAction<boolean>>;
}

const useValidation = (
  checkFunction: () => boolean,
  fields: Array<any>,
  notEmptyTrimmedStr: Array<string> = [],
  defaultValue = false
): IReturnProperties => {
  const [valid, setValid] = useState(defaultValue);

  useEffect(() => setValid(checkFunction() && !notEmptyTrimmedStr.some((el) => el === '')), fields);

  return { valid, setValid };
};

export default useValidation;
