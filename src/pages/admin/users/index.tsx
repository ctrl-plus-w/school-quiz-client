import ROLES from '@constant/roles';
import useAppSelector from '@hooks/useAppSelector';
import useAuthentication from '@hooks/useAuthentication';
import useDebug from '@hooks/useDebug';
import useLoading from '@hooks/useLoading';
import useLoadUsers from '@hooks/useLoadUsers';
import AdminDashboard from '@layout/AdminDashboard';
import AdminDashboardSkeleton from '@layout/AdminDashboardSkeleton ';
import Container from '@module/Container';
import Table from '@module/Table';
import { removeUser, selectUsers } from '@redux/userSlice';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TableSkeleton from '@skeleton/TableSkeleton';
import { genderMapper } from '@util/mapper.utils';
import type { ReactElement } from 'react';

import React from 'react';

const Users = (): ReactElement => {
  const { state: usersState, run: runUsers } = useLoadUsers();
  const { state: authState } = useAuthentication(ROLES.ADMIN.PERMISSION, [runUsers]);

  const { loading } = useLoading([authState, usersState]);

  const users = useAppSelector(selectUsers);

  useDebug(users);

  return loading ? (
    <AdminDashboardSkeleton>
      <ContainerSkeleton subtitle>
        <TableSkeleton
          attributes={[
            ['ID', 'id'],
            ['Prénom', 'firstName'],
            ['Nom', 'lastName'],
            ["Nom d'utilisateur", 'username'],
            ['Sexe', 'gender'],
          ]}
        />
      </ContainerSkeleton>
    </AdminDashboardSkeleton>
  ) : (
    <AdminDashboard>
      <Container title="Utilisateurs" subtitle={{ name: 'Créer un utilisateur', path: '/admin/users/create' }}>
        <Table
          attributes={[
            ['ID', 'id'],
            ['Prénom', 'firstName'],
            ['Nom', 'lastName'],
            ["Nom d'utilisateur", 'username'],
            ['Sexe', 'gender', genderMapper],
          ]}
          data={users}
          apiName="users"
          removeFromStore={removeUser}
        />
      </Container>
    </AdminDashboard>
  );
};

export default Users;
