import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Router from 'next/router';

import { getHeaders } from '@util/authentication.utils';

import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';

import database from '@database/database';

import { selectToken, setToken } from '@redux/authSlice';
import { selectUser, setUser } from '@redux/userSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
}

const useAuthentication = (permission: number, cbOrCbs?: () => void | Array<() => void>): IReturnProperties => {
  const dispatch = useAppDispatch();

  const [cookies] = useCookies();

  const [loading, setLoading] = useState(true);

  const user = useAppSelector(selectUser);
  const reduxToken = useAppSelector(selectToken);

  useEffect(() => {
    (async () => {
      const fail = () => Router.push('/login');

      const cookieToken = cookies.user;

      if (!cookieToken && !reduxToken) fail();

      if (cookieToken) {
        // Validate the token
        try {
          const { data: tokenValidation } = await database.post('/auth/validateToken', {}, getHeaders(cookieToken));
          if (!tokenValidation.valid) fail();
          if (tokenValidation.rolePermission !== permission) fail();

          // Store the token into redux
          dispatch(setToken(cookieToken));

          if (tokenValidation.userId !== user?.id) {
            // Fetch the user
            const { data: fetchedUser } = await database.get(`/api/users/${tokenValidation.userId}`, getHeaders(cookieToken));
            if (!fetchedUser) fail();

            // Store the user into redux
            dispatch(setUser(fetchedUser));
          }
        } catch (err) {
          fail();
        }
      }

      // Stop the loading
      setLoading(false);

      // Call the callback
      if (!cbOrCbs) return;

      const cbs = Array.isArray(cbOrCbs) ? cbOrCbs : [cbOrCbs];
      for (const cb of cbs) cb();
    })();
  }, []);

  return { state: loading ? 'LOADING' : 'FULFILLED' };
};

export default useAuthentication;
