import { useEffect, useState } from 'react';

import Router from 'next/router';

import { getHeaders } from '@util/authentication.utils';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import database from '@database/database';

import { addQuizzes, clearQuizzes } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadQuizzes = (refetch = false): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  const run = () => setRunner(true);

  useEffect(() => {
    if (!runner) return;

    const fail = () => {
      Router.push('/login');
    };

    const compute = async () => {
      if (!token || !user) return fail();

      dispatch(clearQuizzes());

      const { data: quizzes } = await database.get('/api/quizzes/', { ...getHeaders(token), params: { userId: user.id } });
      if (!quizzes) return fail();

      dispatch(addQuizzes(quizzes));
      setLoading(false);
    };

    compute();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadQuizzes;
