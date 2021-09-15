import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { clearTempEvent, selectTempEvent, setTempEvent } from '@redux/eventSlice';
import { selectLoggedUser, selectToken } from '@redux/authSlice';

import { getEvent } from '@api/events';

const useLoadEvent = (eventId: number, config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectLoggedUser);
  const event = useAppSelector(selectTempEvent);

  const { state, run } = useLoad(
    async (fail: VoidFunction) => {
      if (!user || !token) return fail();

      dispatch(clearTempEvent());

      const [event, error] = await getEvent(eventId, token, user.id);

      if (error || !event) return fail();
      dispatch(setTempEvent(event));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [event] }
  );

  return { state, run };
};

export default useLoadEvent;
