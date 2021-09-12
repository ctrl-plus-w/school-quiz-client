import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import useLoad from '@hooks/useLoad';

import { addRoles, clearRoles, selectRoles } from '@redux/roleSlice';
import { selectToken } from '@redux/authSlice';

import { getRoles } from '@api/roles';

const useLoadRoles = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const roles = useAppSelector(selectRoles);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearRoles());

      const [roles, error] = await getRoles(token);
      if (error || !roles) return fail();

      dispatch(addRoles(roles));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [roles] }
  );
};

export default useLoadRoles;
