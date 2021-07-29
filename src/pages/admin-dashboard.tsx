import { GetServerSideProps } from 'next';
import React from 'react';
import Title from '@element/Title';

import Layout from '@layout/Default';

const AdminDashboard = ({}) => {
  return (
    <Layout title="Admin Dashboard">
      <Title>Admin Dashboard</Title>
    </Layout>
  );
};

export default AdminDashboard;
