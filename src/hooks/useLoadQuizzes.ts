import useAppSelector from '@hooks/useAppSelector';
import useAppDispatch from '@hooks/useAppDispatch';
import useLoad from '@hooks/useLoad';

import { getQuizzes } from '@api/quizzes';

import { addQuizzes, clearQuizzes } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

const useLoadQuizzes = (config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const user = useAppSelector(selectUser);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token || !user) return fail();

      dispatch(clearQuizzes());

      const [quizzes, error] = await getQuizzes(token, user.id);

      if (error || !quizzes) return fail();
      dispatch(addQuizzes(quizzes));
    },
    cbs,
    config
  );
};

export default useLoadQuizzes;
