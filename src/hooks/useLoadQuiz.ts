import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { clearTempQuiz, setTempQuiz } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';
import { getQuiz } from '@api/quizzes';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadQuiz = (quizId: number, config?: { notFoundRedirect?: string; refetch?: boolean }): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  const run = () => setRunner(true);

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner || !quizId || isNaN(quizId)) return;

      const compute = async () => {
        if (!token || !user) return fail();

        dispatch(clearTempQuiz());

        const [quiz, error] = await getQuiz(quizId, token, user.id);

        if (error) fail();

        if (quiz) {
          dispatch(setTempQuiz(quiz));
          setLoading(false);
        } else {
          if (config && config.notFoundRedirect) Router.push(config.notFoundRedirect);
          else fail();
        }
      };

      compute();
    })();
  }, [runner, quizId]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadQuiz;
