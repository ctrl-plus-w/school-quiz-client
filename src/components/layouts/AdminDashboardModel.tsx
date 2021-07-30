import Container from '@module/Container';
import React from 'react';
import AdminDashboardLayout from './AdminDashboard';

interface IProps {
  children?: React.ReactNode;
  active: string;
  title: string;
  path: string;
}

const AdminDashboardModelLayout = ({ children, active, title, path }: IProps) => {
  return (
    <AdminDashboardLayout active={active}>
      <Container title={title} path={path}>
        <hr className="mb-8 mt-8" />
        {children}
      </Container>
    </AdminDashboardLayout>
  );
};

export default AdminDashboardModelLayout;
