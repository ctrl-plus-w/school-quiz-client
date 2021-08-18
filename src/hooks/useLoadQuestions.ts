import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getQuestions } from '@api/questions';

import { clearQuestions, addQuestions } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadQuestions = (quizId: number, config?: { refetch?: boolean }): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  const run = () => setRunner(true);

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner || !quizId || isNaN(quizId)) return;

      const compute = async () => {
        if (!token) return fail();

        dispatch(clearQuestions());

        const [questions, error] = await getQuestions(quizId, token);

        if (error || !questions) fail();

        dispatch(addQuestions(questions || []));
        setLoading(false);
      };

      compute();
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadQuestions;
