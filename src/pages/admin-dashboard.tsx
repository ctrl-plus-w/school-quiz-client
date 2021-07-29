import React from 'react';

import Title from '@element/Title';

import Layout from '@layout/Default';

interface IProps {}

const AdminDashboard = ({}: IProps) => {
  return (
    <Layout title="Admin Dashboard" center>
      <Title>Admin Dashboard</Title>
    </Layout>
  );
};

export default AdminDashboard;
