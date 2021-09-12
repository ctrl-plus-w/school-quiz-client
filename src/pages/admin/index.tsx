import type { ReactElement } from 'react';

import AdminDashboard from '@layout/AdminDashboard';
import AdminDashboardSkeleton from '@layout/AdminDashboardSkeleton ';

import Container from '@module/Container';

import ContainerSkeleton from '@skeleton/ContainerSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useLoading from '@hooks/useLoading';

import ROLES from '@constant/roles';

import React from 'react';

const Admin = (): ReactElement => {
  const { state: authState } = useAuthentication(ROLES.ADMIN.PERMISSION);

  const { loading } = useLoading([authState]);

  return loading ? (
    <AdminDashboardSkeleton>
      <ContainerSkeleton></ContainerSkeleton>
    </AdminDashboardSkeleton>
  ) : (
    <AdminDashboard>
      <Container title="Admin dashboard"></Container>
    </AdminDashboard>
  );
};

export default Admin;
