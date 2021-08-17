import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Router from 'next/router';

import { getHeaders } from '@util/authentication.utils';

import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';

import database from '@database/database';

import { selectUser, setUser } from '@redux/userSlice';
import { setToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
}

const useAuthentication = (permission: number, cbOrCbs?: () => void | Array<() => void>): IReturnProperties => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);

  const [cookies] = useCookies();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fail = () => {
      Router.push('/login');
    };

    const token = cookies.user;
    if (!token) fail();

    const compute = async () => {
      // Validate the token
      try {
        const { data: tokenValidation } = await database.post('/auth/validateToken', {}, getHeaders(token));
        if (!tokenValidation.valid) fail();
        if (tokenValidation.rolePermission !== permission) fail();

        if (tokenValidation.userId !== user?.id) {
          // Store the token into redux
          dispatch(setToken(token));

          // Fetch the user
          const { data: fetchedUser } = await database.get(`/api/users/${tokenValidation.userId}`, getHeaders(token));
          if (!fetchedUser) fail();

          // Store the user into redux
          dispatch(setUser(fetchedUser));
        }
      } catch (err) {
        fail();
      }

      // Stop the loading
      setLoading(false);

      // Call the callback
      if (!cbOrCbs) return;

      const cbs = Array.isArray(cbOrCbs) ? cbOrCbs : [cbOrCbs];
      for (const cb of cbs) cb();
    };

    compute();
  }, []);

  return { state: loading ? 'LOADING' : 'FULFILLED' };
};

export default useAuthentication;
