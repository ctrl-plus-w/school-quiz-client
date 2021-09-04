import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { addEvents, clearEvents } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';
import { getEvents } from '@api/events';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadEvents = (refetch = false): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  const run = () => {
    setRunner(true);
    setLoading(true);
  };

  useEffect(() => {
    if (!runner) return;

    const fail = () => {
      Router.push('/login');
    };

    const compute = async () => {
      if (!token || !user) return fail();

      dispatch(clearEvents());

      const [events, error] = await getEvents(user.id, token);
      if (error || !events) return fail();

      dispatch(addEvents(events));
      setLoading(false);
    };

    compute();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadEvents;
