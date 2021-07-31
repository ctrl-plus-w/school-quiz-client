import React, { FunctionComponent } from 'react';
import { useRouter } from 'next/dist/client/router';
import { v4 as uuidv4 } from 'uuid';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';

type ServerSideProps = {
  users: Array<User>;
  token: string;
};

const cellClassName = 'px-4 py-3 text-gray-500 border-t border-gray-300 text-sm group-hover:bg-gray-200 cursor-pointer';

const AdminUsersDashboard: FunctionComponent<ServerSideProps> = ({ users }: ServerSideProps) => {
  const router = useRouter();

  const seeUserProfile = (userId: number): void => {
    router.push({
      pathname: '/admin/users/[id]',
      query: { id: userId },
    });
  };

  return (
    <AdminDashboardModelsLayout active="Utilisateurs" title="Utilisateurs" subtitle={{ name: 'Créer un utilisateur', path: '/admin/users/create' }}>
      <table className="table-auto w-full mt-14">
        <thead>
          <tr>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">ID</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Nom d&apos;utilisateur</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Prénom</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Nom de famille</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Genre</td>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={uuidv4()} className="group" onClick={() => seeUserProfile(user.id)}>
              <td className={cellClassName}>{user.id}</td>
              <td className={cellClassName}>{user.username}</td>
              <td className={cellClassName}>{user.firstName}</td>
              <td className={cellClassName}>{user.lastName}</td>
              <td className={cellClassName}>{typeof user.gender === 'boolean' ? (user.gender ? 'Male' : 'Female') : 'None'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminDashboardModelsLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const token = context.req.cookies.user;
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== roles.ADMIN.PERMISSION) throw new Error();

    const { data: users } = await database.get('/api/users', getHeaders(token));

    const props: ServerSideProps = { token, users };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default AdminUsersDashboard;
