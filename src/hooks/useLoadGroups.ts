import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getGroups } from '@api/groups';

import { addGroups, clearGroups, selectGroups } from '@redux/groupSlice';
import { selectToken } from '@redux/authSlice';

import useLoad from '@hooks/useLoad';

const useLoadGroups = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const groups = useAppSelector(selectGroups);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearGroups());

      const [fetchedGroups, error] = await getGroups(token);
      if (error || !fetchedGroups) return fail();

      dispatch(addGroups(fetchedGroups));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [groups] }
  );
};

export default useLoadGroups;
