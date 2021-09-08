import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getQuestionToCorrect } from '@api/questions';

import { setTempQuestion, clearTempQuestion } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadQuestionToCorrect = (
  eventId: number,
  questionId: number,
  config?: { refetch?: boolean; notFoundRedirect?: string }
): IReturnProperties => {
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
      if (!runner || !questionId || isNaN(questionId)) return;

      const compute = async () => {
        if (!token) return fail();

        const [question, error] = await getQuestionToCorrect(eventId, questionId, token);

        if (error) fail();

        if (question) {
          dispatch(question ? setTempQuestion(question) : clearTempQuestion());
          setLoading(false);
        } else {
          if (config && config.notFoundRedirect) Router.push(config.notFoundRedirect);
          else fail();
        }
      };

      compute();
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadQuestionToCorrect;
