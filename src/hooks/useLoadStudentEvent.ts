import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getStudentEvent } from '@api/events';

import { clearTempEvent, selectTempEvent, setTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadStudentEvent = (config?: { notFoundRedirect?: string; doNotRefetch?: boolean }, cbs?: Array<() => void>): IReturnProperties => {
  const dispatch = useAppDispatch();

  const [runner, setRunner] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const event = useAppSelector(selectTempEvent);

  const run = () => {
    setRunner(true);
    setLoading(true);
  };

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner) return;

      const compute = async () => {
        if (!token || !user) return fail();

        dispatch(clearTempEvent());

        const [event, error] = await getStudentEvent(token);

        if (error && error.status === 404 && config && config.notFoundRedirect) return Router.push(config.notFoundRedirect);
        else if (error && error.status !== 404) return fail();

        if (event) dispatch(setTempEvent(event));
      };

      if (!config || (config.doNotRefetch === true && !event) || !config?.doNotRefetch) compute();

      if (cbs) for (const cb of cbs) cb();

      setLoading(false);
      setRunner(false);
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadStudentEvent;
