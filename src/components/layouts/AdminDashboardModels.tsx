import { useRouter } from 'next/dist/client/router';
import { FunctionComponent } from 'react';

import React from 'react';

import AdminDashboardLayout from '@layout/AdminDashboard';

import Container from '@module/Container';

interface IProps {
  children?: React.ReactNode;
  title: string;
  subtitle: string;
}

const AdminDashboardModelsLayout: FunctionComponent<IProps> = ({ children, title, subtitle }: IProps) => {
  const router = useRouter();

  return (
    <AdminDashboardLayout>
      <Container title={title} subtitle={{ name: subtitle, path: `${router.pathname}/create` }}>
        {children}
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelsLayout;
