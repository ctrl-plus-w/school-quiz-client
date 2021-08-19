import { useEffect, useState } from 'react';

import { isOneLoading } from '@util/condition.utils';

interface IReturnProperties {
  loading: boolean;
}

const useLoading = (states: Array<'LOADING' | 'FULFILLED'>, defaultValue = true): IReturnProperties => {
  const [loading, setLoading] = useState(defaultValue);

  useEffect(() => {
    setLoading(isOneLoading(states));
  }, states);

  return { loading };
};

export default useLoading;
