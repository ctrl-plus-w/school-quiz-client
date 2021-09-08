import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getStudentEvent } from '@api/events';

import { clearTempEvent, selectTempEvent, setTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';

const useLoadStudentEvent = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const event = useAppSelector(selectTempEvent);

  return useLoad(
    async (fail: VoidFunction, redirect: ILoadHookRedirectFunction) => {
      if (!token) return fail();

      dispatch(clearTempEvent());

      const [fetchedEvent, error] = await getStudentEvent(token);

      if (error || !fetchedEvent) {
        if (error && error.status === 404) return redirect(config?.notFoundRedirect);
        return fail();
      }

      dispatch(setTempEvent(fetchedEvent));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [event] }
  );
};

export default useLoadStudentEvent;
