import React, { FunctionComponent } from 'react';

import AdminDashboardLayout from '@layout/AdminDashboard';

import Container from '@module/Container';
import { useRouter } from 'next/dist/client/router';

interface IProps {
  children?: React.ReactNode;
  active: string;
  title: string;
  subtitle: string;
}

const AdminDashboardModelsLayout: FunctionComponent<IProps> = ({ children, active, title, subtitle }: IProps) => {
  const router = useRouter();

  return (
    <AdminDashboardLayout active={active}>
      <Container title={title} subtitle={{ name: subtitle, path: `${router.pathname}/create` }}>
        {children}
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelsLayout;
