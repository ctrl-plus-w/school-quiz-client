import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getQuestions } from '@api/questions';

import { clearQuestions, addQuestions, selectQuestions } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

const useLoadQuestions = (quizId: number, config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const questions = useAppSelector(selectQuestions);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearQuestions());

      const [fetchedQuestions, error] = await getQuestions(quizId, token);

      if (error || !fetchedQuestions) return fail();
      dispatch(addQuestions(fetchedQuestions));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [questions] }
  );
};

export default useLoadQuestions;
