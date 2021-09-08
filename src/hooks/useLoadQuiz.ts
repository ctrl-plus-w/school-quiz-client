import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { selectTempQuiz, setTempQuiz } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

import { getQuiz } from '@api/quizzes';

const useLoadQuiz = (quizId: number, config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);
  const quiz = useAppSelector(selectTempQuiz);

  return useLoad(
    async (fail: VoidFunction, redirect: ILoadHookRedirectFunction) => {
      if (!token || !user) return fail();

      const [fetchedQuiz, error] = await getQuiz(quizId, token, user.id);

      if (error || !fetchedQuiz) {
        if (error && error.status === 404) return redirect(config?.notFoundRedirect);
        return fail();
      }

      dispatch(setTempQuiz(fetchedQuiz));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [quiz] }
  );
};

export default useLoadQuiz;
