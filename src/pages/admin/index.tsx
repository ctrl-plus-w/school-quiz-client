import { FunctionComponent } from 'react';
import { GetServerSideProps } from 'next';

import React from 'react';

import AdminDashboardLayout from '@layout/AdminDashboard';

import { getServerSidePropsAdminFunction } from '@util/authentication.utils';

const AdminDashboard: FunctionComponent = () => {
  return <AdminDashboardLayout></AdminDashboardLayout>;
};

export const getServerSideProps: GetServerSideProps = getServerSidePropsAdminFunction;

export default AdminDashboard;
