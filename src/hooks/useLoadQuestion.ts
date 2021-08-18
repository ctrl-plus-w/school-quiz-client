import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getQuestion } from '@api/questions';

import { clearQuestions, setTempQuestion } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadQuestion = (quizId: number, questionId: number, config?: { notFoundRedirect?: string; refetch?: boolean }): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  const run = () => setRunner(true);

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner || !quizId || !questionId || isNaN(quizId) || isNaN(questionId)) return;

      const compute = async () => {
        if (!token) return fail();

        dispatch(clearQuestions());

        const [question, error] = await getQuestion(quizId, questionId, token);

        if (error) fail();

        if (question) {
          dispatch(setTempQuestion(question));
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

export default useLoadQuestion;
