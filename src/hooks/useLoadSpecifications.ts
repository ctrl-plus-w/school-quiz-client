import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getSpecifications } from '@api/questions';

import { addSpecifications, clearSpecifications } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadSpecifications = (config?: { refetch?: boolean }): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  const run = () => {
    setRunner(true);
    setLoading(true);
  };

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner) return;

      const compute = async () => {
        if (!token) return fail();

        dispatch(clearSpecifications());

        const [specifications, error] = await getSpecifications(token);

        if (error || !specifications) fail();

        if (!specifications) return;

        dispatch(addSpecifications(specifications));
        setLoading(false);
      };

      compute();
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadSpecifications;
