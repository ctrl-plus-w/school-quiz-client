import Container from '@module/Container';
import React from 'react';
import AdminDashboardLayout from './AdminDashboard';

interface IProps {
  children?: React.ReactNode;
  active: string;
  title: string;
  subtitle: { name: string; path: string } | string;
}

const AdminDashboardModelsLayout = ({ children, active, title, subtitle }: IProps) => {
  return (
    <AdminDashboardLayout active={active}>
      <Container title={title} subtitle={subtitle}>
        {children}
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelsLayout;
