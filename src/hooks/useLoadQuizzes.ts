import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getQuizzes } from '@api/quizzes';

import { addQuizzes, clearQuizzes, selectQuizzes } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

const useLoadQuizzes = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const quizzes = useAppSelector(selectQuizzes);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token || !user) return fail();

      dispatch(clearQuizzes());

      const [fetchedQuizzes, error] = await getQuizzes(token, user.id);

      if (error || !fetchedQuizzes) return fail();
      dispatch(addQuizzes(fetchedQuizzes));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [quizzes] }
  );
};

export default useLoadQuizzes;
