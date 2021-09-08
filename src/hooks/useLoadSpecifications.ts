import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getSpecifications } from '@api/questions';

import { addSpecifications, clearSpecifications } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

const useLoadSpecifications = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearSpecifications());

      const [specifications, error] = await getSpecifications(token);

      if (error || !specifications) return fail();
      dispatch(addSpecifications(specifications));
    },
    cbs,
    config
  );
};

export default useLoadSpecifications;
