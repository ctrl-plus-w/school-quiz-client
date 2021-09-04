import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getStudentQuestion } from '@api/questions';

import { clearTempQuestion, selectTempQuestion, setTempQuestion } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadStudentQuestion = (config?: { notFoundRedirect?: string; doNotRefetch?: boolean }, cbs?: Array<() => void>): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const question = useAppSelector(selectTempQuestion);

  const run = () => {
    setRunner(true);
    setLoading(true);
    clearTempQuestion();
  };

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner) return;

      const compute = async () => {
        if (!token) return fail();

        dispatch(clearTempQuestion());

        const [question, error] = await getStudentQuestion(token);

        if (error && error.status === 404 && config && config.notFoundRedirect) return Router.push(config.notFoundRedirect);
        else if (error && error.status !== 404) return fail();

        if (question) dispatch(setTempQuestion(question));
      };

      if (!config || (config.doNotRefetch === true && !question) || !config?.doNotRefetch) await compute();

      if (cbs) for (const cb of cbs) cb();

      setLoading(false);
      console.log('Set the loading to false');
      setRunner(false);
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadStudentQuestion;
