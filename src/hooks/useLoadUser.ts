import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import useLoad from '@hooks/useLoad';

import { clearUser, selectUser, setUser } from '@redux/userSlice';
import { selectToken } from '@redux/authSlice';

import { getUser } from '@api/users';

const useLoadUser = (userId: number, config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  return useLoad(
    async (fail: VoidFunction, redirect: ILoadHookRedirectFunction) => {
      if (!token) return;

      dispatch(clearUser());

      const [user, error] = await getUser(userId, token);

      if (error || !user) {
        if (error && error.status === 404) return redirect(config?.notFoundRedirect);
        return fail();
      }

      dispatch(setUser(user));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [user] }
  );
};

export default useLoadUser;
