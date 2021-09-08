import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import useLoad from '@hooks/useLoad';

import { addUsers, clearProfessors, clearUsers } from '@redux/userSlice';
import { selectToken } from '@redux/authSlice';
import { getUsers } from '@api/users';

const useLoadUsers = (role?: 'professeur', config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return;

      const isProfessor = role === 'professeur';

      dispatch(isProfessor ? clearProfessors() : clearUsers());

      const [users, error] = await getUsers(token, isProfessor ? 'professeur' : undefined);

      if (error || !users) fail();
      else dispatch(addUsers(users));
    },
    cbs,
    config
  );
};

export default useLoadUsers;
