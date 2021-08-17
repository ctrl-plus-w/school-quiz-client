import { ReactElement } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import React from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import Title from '@element/Title';

import { getHeaders } from '@util/authentication.utils';

import database from '@database/database';

import ROLES from '@constant/roles';

interface IProps {
  user: IUser;
}

const Professor = ({ user }: IProps): ReactElement => {
  return (
    <ProfessorDashboard>
      <div className="flex flex-col py-12 px-12">
        <Title>Bienvenue, {user.firstName} !</Title>

        <p className="text-gray-600 font-normal mt-4">
          Vous avez sur cette page les informations globales ainsi que les informations les plus importantes.
        </p>
      </div>
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

    const { data: user } = await database.get(`/api/users/${data.userId}`, getHeaders(token));

    if (!user) throw new Error();

    return { props: { user } };
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
