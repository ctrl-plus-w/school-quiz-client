import React, { FunctionComponent } from 'react';

import AdminDashboardLayout from '@layout/AdminDashboard';

import Container from '@module/Container';

interface IProps {
  children?: React.ReactNode;
  active: string;
  title: string;
  subtitle: { name: string; path: string } | string;
}

const AdminDashboardModelsLayout: FunctionComponent<IProps> = ({ children, active, title, subtitle }: IProps) => {
  return (
    <AdminDashboardLayout active={active}>
      <Container title={title} subtitle={subtitle}>
        {children}
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelsLayout;
