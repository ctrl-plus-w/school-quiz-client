import React, { FunctionComponent } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';
import { v4 as uuidv4 } from 'uuid';

import AdminDashboardModelsLayout from '@layout/AdminDashboardModels';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';

interface IProps {
  labels: Array<Label>;
}

const cellClassName = 'px-4 py-3 text-gray-500 border-t border-gray-300 text-sm group-hover:bg-gray-200 cursor-pointer';

const AdminLabelsDashboard: FunctionComponent<IProps> = ({ labels }: IProps) => {
  const router = useRouter();

  const seeLabel = (groupId: number): void => {
    router.push({
      pathname: '/admin/labels/[id]',
      query: { id: groupId },
    });
  };

  return (
    <AdminDashboardModelsLayout active="Labels" title="Labels" subtitle={{ name: 'Créer un label', path: '/admin/labels/create' }}>
      <table className="table-auto w-full mt-14">
        <thead>
          <tr>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">ID</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Nom</td>
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm">Slug</td>
          </tr>
        </thead>

        <tbody>
          {labels.map((label) => (
            <tr key={uuidv4()} className="group" onClick={() => seeLabel(label.id)}>
              <td className={cellClassName}>{label.id}</td>
              <td className={cellClassName}>{label.name}</td>
              <td className={cellClassName}>{label.slug}</td>
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

    const { data: labels } = await database.get('/api/labels', getHeaders(token));
    if (!labels) throw new Error();

    return {
      props: {
        labels,
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

export default AdminLabelsDashboard;
