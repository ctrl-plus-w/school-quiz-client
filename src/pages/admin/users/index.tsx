import React, { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import { useRouter } from 'next/dist/client/router';

interface IProps {
  users: Array<User>;
}

const cellClassName = 'px-4 py-3 text-gray-500 border-t border-gray-300 text-sm group-hover:bg-gray-200 cursor-pointer';

const AdminDashboard: FunctionComponent<IProps> = ({ users }: IProps) => {
  const router = useRouter();

  const seeUserProfile = (userId: number): void => {
    router.push({
      pathname: '/admin/users/[id]',
      query: { id: userId },
    });
  };

  return (
    <AdminDashboardModelsLayout active="Utilisateurs" title="Utilisateurs" subtitle="Créer un utilisateur">
      <table className="table-auto w-full mt-14">
        <thead>
          <tr>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">ID</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Username</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">First name</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Last name</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Gender</td>
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

    return {
      props: {
        users,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};

export default AdminDashboard;
