import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getQuestion } from '@api/questions';

import { clearTempQuestion, selectTempQuestion, setTempQuestion } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

import useLoad from '@hooks/useLoad';

const useLoadQuestion = (
  quizId: number,
  questionId: number,

  config?: ILoadHookConfig,
  cbs?: Array<VoidFunction>
): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const question = useAppSelector(selectTempQuestion);

  return useLoad(
    async (fail: VoidFunction, redirect: ILoadHookRedirectFunction) => {
      if (!token) return fail();

      dispatch(clearTempQuestion());

      const [fetchedQuestion, error] = await getQuestion(quizId, questionId, token);

      if (error || !fetchedQuestion) {
        if (error && error.status === 404) return redirect(config?.notFoundRedirect);
        return fail();
      }

      dispatch(setTempQuestion(fetchedQuestion));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [question] }
  );
};

export default useLoadQuestion;
