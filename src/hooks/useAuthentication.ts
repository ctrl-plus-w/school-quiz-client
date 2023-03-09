import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import Router from 'next/router';

import { getHeaders } from '@util/authentication.utils';

import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';

import database from '@database/database';

import { selectLoggedUser, selectToken, setLoggedUser, setToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
}

const useAuthentication = (permission: number, cbs?: (() => void)[]): IReturnProperties => {
  const dispatch = useAppDispatch();

  const [cookies] = useCookies();

  const [loading, setLoading] = useState(true);

  const user = useAppSelector(selectLoggedUser);
  const reduxToken = useAppSelector(selectToken);

  useEffect(() => {
    (async () => {
      const fail = () => Router.push('/login');

      const cookieToken = cookies.user;

      if (!cookieToken && !reduxToken) fail();
      console.log('Passed stage 1 (retrieved the cookie or redux token)');

      if (cookieToken) {
        // Validate the token
        try {
          console.log('Getting authentified by the token');
          const { data: tokenValidation } = await database.post('/auth/validateToken', {}, getHeaders(cookieToken));
          if (!tokenValidation.valid) fail();
          if (tokenValidation.rolePermission !== permission) fail();

          console.log('Got authentified');

          // Store the token into redux
          dispatch(setToken(cookieToken));

          if (tokenValidation.userId !== user?.id) {
            // Fetch the user
            const { data: fetchedUser } = await database.get(`/api/users/${tokenValidation.userId}`, getHeaders(cookieToken));
            if (!fetchedUser) fail();

            // Store the user into redux
            dispatch(setLoggedUser(fetchedUser));
          }
        } catch (err) {
          fail();
        }
      }

      // Stop the loading
      setLoading(false);

      // Call the callback
      if (!cbs) return;
      for (const cb of cbs) cb();
    })();
  }, []);

  return { state: loading ? 'LOADING' : 'FULFILLED' };
};

export default useAuthentication;
