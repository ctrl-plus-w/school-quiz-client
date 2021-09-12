import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import useLoad from '@hooks/useLoad';

import { getUsers } from '@api/users';

import { addUsers, clearProfessors, clearUsers, selectUsers } from '@redux/userSlice';
import { selectToken } from '@redux/authSlice';

const useLoadUsers = (role?: 'professeur', config?: ILoadHookConfig, cbs?: Array<VoidFunction>): ILoadHookReturnProperties => {
  const dispatch = useAppDispatch();

  const token = useAppSelector(selectToken);
  const users = useAppSelector(selectUsers);

  return useLoad(
    async (fail: VoidFunction) => {
      if (!token) return;

      const isProfessor = role === 'professeur';

      dispatch(isProfessor ? clearProfessors() : clearUsers());

      const [fetchedUsers, error] = await getUsers(token, isProfessor ? 'professeur' : undefined);

      if (error || !fetchedUsers) fail();
      else dispatch(addUsers(fetchedUsers));
    },
    cbs,
    { ...config, refetchNullValuesToCheck: [users] }
  );
};

export default useLoadUsers;
