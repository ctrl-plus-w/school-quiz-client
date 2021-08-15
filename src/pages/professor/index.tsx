import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import React from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import ROLES from '@constant/roles';

const Professor = (): ReactElement => {
  return (
    <ProfessorDashboard>
      <h1>Hello World</h1>
    </ProfessorDashboard>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.req.cookies.user;
    if (!token) throw new Error();

    const { data } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!data.valid) throw new Error();

    if (data.rolePermission !== ROLES.PROFESSOR.PERMISSION) throw new Error();

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

export default Professor;
