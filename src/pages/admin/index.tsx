import React, { FunctionComponent } from 'react';

import { GetServerSideProps } from 'next';

import AdminDashboardLayout from '@layout/AdminDashboard';

import { getServerSidePropsAdminFunction } from '@util/authentication.utils';

const AdminDashboard: FunctionComponent = () => {
  return <AdminDashboardLayout active="Accueil"></AdminDashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsAdminFunction;

export default AdminDashboard;
