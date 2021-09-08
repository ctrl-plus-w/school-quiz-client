import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getGroups } from '@api/groups';

import { addGroups, clearGroups } from '@redux/groupSlice';
import { selectToken } from '@redux/authSlice';

import useLoad from '@hooks/useLoad';

const useLoadGroups = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearGroups());

      const [groups, error] = await getGroups(token);
      if (error || !groups) return fail();

      dispatch(addGroups(groups));
    },
    cbs,
    config
  );
};

export default useLoadGroups;
