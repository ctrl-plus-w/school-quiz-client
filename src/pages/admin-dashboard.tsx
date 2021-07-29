import React from 'react';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Link from 'next/link';

import Title from '@element/Title';

import Layout from '@layout/Default';

import database from 'database/database';
import { getHeaders } from '@util/authentication.utils';
import roles from '@constant/roles';

interface IProps {}

const AdminDashboard = ({}: IProps) => {
  return (
    <Layout title="Admin Dashboard" center>
      <Title>Admin Dashboard</Title>

      <Link href="/">
        <a>Index</a>
      </Link>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.req.cookies.user;
    if (!token) throw new Error();

    const { data } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!data.valid) throw new Error();

    if (data.rolePermission !== roles.ADMIN.PERMISSION) throw new Error();

    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};

export default AdminDashboard;
