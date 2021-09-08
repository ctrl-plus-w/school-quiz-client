import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getQuestionToCorrect } from '@api/questions';

import { setTempQuestion, clearTempQuestion, selectTempQuestion } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';

const useLoadQuestionToCorrect = (
  eventId: number,
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

      const [fetchedQuestion, error] = await getQuestionToCorrect(eventId, questionId, token);

      if (error || !fetchedQuestion) {
        if (error && error.status == 404) return redirect(config?.notFoundRedirect);
        return fail();
      }

      dispatch(setTempQuestion(fetchedQuestion));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [question] }
  );
};

export default useLoadQuestionToCorrect;
