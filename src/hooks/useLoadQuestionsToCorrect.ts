import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';

import { getQuestionsToCorrect } from '@api/questions';

import { clearQuestions, addQuestions } from '@redux/questionSlice';
import { selectToken } from '@redux/authSlice';
import useLoad from './useLoad';

const useLoadQuestionsToCorrect = (eventId: number, config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return fail();

      dispatch(clearQuestions());

      const [questions, error] = await getQuestionsToCorrect(eventId, token);

      if (error || !questions) return fail();
      dispatch(addQuestions(questions));
    },
    cbs,
    config
  );
};

export default useLoadQuestionsToCorrect;
