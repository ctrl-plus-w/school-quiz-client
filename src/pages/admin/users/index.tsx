import type { ReactElement } from 'react';

import React from 'react';

import AdminDashboardSkeleton from '@layout/AdminDashboardSkeleton ';
import AdminDashboard from '@layout/AdminDashboard';

import Container from '@module/Container';
import Table from '@module/Table';

import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TableSkeleton from '@skeleton/TableSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadUsers from '@hooks/useLoadUsers';
import useLoading from '@hooks/useLoading';

import { genderMapper } from '@util/mapper.utils';

import { removeUser, selectUsers } from '@redux/userSlice';

import ROLES from '@constant/roles';

const Users = (): ReactElement => {
  const { state: usersState, run: runUsers } = useLoadUsers();
  const { state: authState } = useAuthentication(ROLES.ADMIN.PERMISSION, [runUsers]);

  const { loading } = useLoading([authState, usersState]);

  const users = useAppSelector(selectUsers);

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
          action
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
          deleteAction={{ apiName: 'users', removeFromStoreReducer: removeUser }}
        />
      </Container>
    </AdminDashboard>
  );
};

export default Users;
