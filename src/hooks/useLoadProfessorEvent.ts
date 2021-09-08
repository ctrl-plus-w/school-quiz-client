import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { clearTempEvent, selectTempEvent, setTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

import useLoad from '@hooks/useLoad';
import { getProfessorEvent } from '@api/events';

const useLoadProfessorEvent = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const event = useAppSelector(selectTempEvent);

  return useLoad(
    async (fail: VoidFunction, redirect: ILoadHookRedirectFunction) => {
      if (!token || !user) return fail();

      dispatch(clearTempEvent());

      const [event, error] = await getProfessorEvent(token);

      if (error || !event) {
        if (error && error.status === 404) return redirect(config?.notFoundRedirect);
        return fail();
      }

      dispatch(setTempEvent(event));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [event] }
  );
};

export default useLoadProfessorEvent;
