import React, { FunctionComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import { useRouter } from 'next/dist/client/router';

type ServerSideProps = {
  groups: Array<Group>;
};

const cellClassName = 'px-4 py-3 text-gray-500 border-t border-gray-300 text-sm group-hover:bg-gray-200 cursor-pointer';

const AdminGroupsDashboard: FunctionComponent<ServerSideProps> = ({ groups }: ServerSideProps) => {
  const router = useRouter();

  const seeGroup = (groupId: number): void => {
    router.push({
      pathname: '/admin/groups/[id]',
      query: { id: groupId },
    });
  };

  return (
    <AdminDashboardModelsLayout active="Groupes" title="Groupes" subtitle={{ name: 'Créer un groupe', path: '/admin/groups/create' }}>
      <table className="table-auto w-full mt-14">
        <thead>
          <tr>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">ID</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Nom</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Slug</td>
          </tr>
        </thead>

        <tbody>
          {groups.map((group) => (
            <tr key={uuidv4()} className="group" onClick={() => seeGroup(group.id)}>
              <td className={cellClassName}>{group.id}</td>
              <td className={cellClassName}>{group.name}</td>
              <td className={cellClassName}>{group.slug}</td>
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

    const { data: groups } = await database.get('/api/groups', getHeaders(token));

    const props: ServerSideProps = { groups };

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

export default AdminGroupsDashboard;
