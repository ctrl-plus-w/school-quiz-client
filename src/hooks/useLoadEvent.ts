import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getEvent } from '@api/events';

import { clearTempEvent, setTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadEvent = (eventId: number, config?: { notFoundRedirect: string }): IReturnProperties => {
  const dispatch = useAppDispatch();

  const [runner, setRunner] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  const run = () => setRunner(true);

  useEffect(() => {
    const fail = () => Router.push('/login');

    (async () => {
      if (!runner || !eventId || isNaN(eventId)) return;

      const compute = async () => {
        if (!token || !user) return fail();

        dispatch(clearTempEvent());

        const [event, error] = await getEvent(eventId, token, user.id);

        if (!event && config && config.notFoundRedirect) return Router.push(config.notFoundRedirect);

        if (error || !event) return fail();

        dispatch(setTempEvent(event));
        setLoading(false);
      };

      compute();
    })();
  }, [runner, eventId]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadEvent;
