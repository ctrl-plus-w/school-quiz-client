import { useEffect, useState } from 'react';

import Router from 'next/router';

import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getGroups } from '@api/groups';

import { addGroups, clearGroups } from '@redux/groupSlice';
import { selectToken } from '@redux/authSlice';

interface IReturnProperties {
  state: 'LOADING' | 'FULFILLED';
  run: () => void;
}

const useLoadGroups = (refetch = false): IReturnProperties => {
  const [runner, setRunner] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  const run = () => setRunner(true);

  useEffect(() => {
    if (!runner) return;

    const fail = () => {
      Router.push('/login');
    };

    const compute = async () => {
      if (!token) return fail();

      dispatch(clearGroups());

      const [groups, error] = await getGroups(token);

      if (error || !groups) return fail();

      dispatch(addGroups(groups));
      setLoading(false);
    };

    compute();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoadGroups;
