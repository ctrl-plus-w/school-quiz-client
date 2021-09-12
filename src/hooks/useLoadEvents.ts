import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getEvents } from '@api/events';

import { addEvents, clearEvents, selectEvents } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

const useLoadEvents = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);
  const events = useAppSelector(selectEvents);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!user || !token) return fail();

      dispatch(clearEvents());

      const [fetchedEvents, error] = await getEvents(user.id, token);

      if (error || !fetchedEvents) return fail();
      dispatch(addEvents(fetchedEvents));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [events] }
  );
};

export default useLoadEvents;
