import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getSpecifications } from '@api/questions';

import { addSpecifications, clearSpecifications, selectSpecifications } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

const useLoadSpecifications = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const specifications = useAppSelector(selectSpecifications);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearSpecifications());

      const [fetchedSpecifications, error] = await getSpecifications(token);

      if (error || !fetchedSpecifications) return fail();
      dispatch(addSpecifications(fetchedSpecifications));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [specifications] }
  );
};

export default useLoadSpecifications;
