import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';

import { addProfessors, addUsers, clearProfessors, clearUsers } from '@redux/userSlice';
import { selectToken } from '@redux/authSlice';
import { getUsers } from '@api/users';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadUsers = (role?: 'professeur'): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  const run = (): void => setRunner(true);

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner) return;

      const compute = async () => {
        if (!token) return fail();

        if (role === 'professeur') {
          dispatch(clearProfessors());

          const [users, error] = await getUsers(token, 'professeur');

          if (error || !users) fail();
          else dispatch(addProfessors(users));
        } else {
          dispatch(clearUsers());

          const [users, error] = await getUsers(token);

          if (error || !users) fail();
          else dispatch(addUsers(users));
        }

        setLoading(false);
      };

      compute();
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadUsers;
