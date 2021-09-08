import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { addEvents, clearEvents } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

import { getEvents } from '@api/events';

import useLoad from '@hooks/useLoad';

const useLoadEvents = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const token = useAppSelector(selectToken);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!user || !token) return fail();

      dispatch(clearEvents());

      const [events, error] = await getEvents(user.id, token);

      if (error || !events) return fail();
      dispatch(addEvents(events));
    },
    cbs,
    config
  );
};

export default useLoadEvents;
