import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getQuestionsToCorrect } from '@api/questions';

import { clearQuestions, addQuestions } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadQuestionsToCorrect = (eventId: number, config?: { refetch?: boolean }): IReturnProperties => {
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
      if (!runner || !eventId || isNaN(eventId)) return;

      const compute = async () => {
        if (!token) return fail();

        dispatch(clearQuestions());

        const [questions, error] = await getQuestionsToCorrect(eventId, token);

        if (error || !questions) fail();

        dispatch(addQuestions(questions || []));
        setLoading(false);
      };

      compute();
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadQuestionsToCorrect;
