import { useEffect, useState } from 'react';

import { isOneLoading } from '@util/condition.utils';
import { isNull } from '@util/mapper.utils';

interface IReturnProperties {
  loading: boolean;
}

const useLoading = (states: Array<'LOADING' | 'FULFILLED'>, existsValues: Array<any> = [], defaultValue = true): IReturnProperties => {
  const [loading, setLoading] = useState(defaultValue);

  useEffect(() => {
    setLoading(isOneLoading(states) || existsValues.some(isNull));
  }, states);

  return { loading };
};

export default useLoading;
