import React, { FormEvent, FunctionComponent, useContext, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import Input from '@element/Input';
import Title from '@element/Title';

import FormGroup from '@module/FormGroup';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import { getHeaders } from '@util/authentication.utils';

import ROLES from '@constant/roles';

import database from 'database/database';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';
import TagsInput from '@element/TagsInput';

type ServerSideProps = {
  group: Group;
  labels: Array<Label>;
  token: string;
};

const Group: FunctionComponent<ServerSideProps> = ({ group, labels, token }: ServerSideProps) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [name, setName] = useState(group.name);

  const [groupLabels, setGroupLabels] = useState<Array<IBasicModel>>(group.labels.map(({ id, name, slug }: Label) => ({ id, name, slug })));

  const addLabel = (label: IBasicModel) => {
    setGroupLabels((prev) => [...prev, label]);
  };

  const removeLabel = (label: IBasicModel) => {
    setGroupLabels((prev) => prev.filter((_label) => _label !== label));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (group.labels && groupLabels !== group.labels) {
        const oldLabels = group.labels.filter(({ id }) => !groupLabels.some(({ id: _id }) => id === _id));
        const oldLabelsId = oldLabels.map(({ id }) => id);

        if (oldLabelsId.length > 0) {
          for (const oldLabelId of oldLabelsId) {
            await database.delete(`/api/groups/${group.id}/labels/${oldLabelId}`, getHeaders(token));
          }
        }

        const newLabels = groupLabels.filter(({ id }) => !group.labels.some(({ id: _id }) => id === _id));
        const newLabelsId = newLabels.map(({ id }) => id);

        if (newLabelsId.length > 0) {
          await database.post(`/api/groups/${group.id}/labels`, { labelIds: newLabelsId }, getHeaders(token));
        }
      }

      if (name !== group.name) {
        await database.put(`/api/groups/${group.id}`, { name }, getHeaders(token));
      }

      addNotification({ content: 'Groupe modifié.', type: 'INFO' });

      router.push('/admin/groups');
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    }
  };

  return (
    <AdminDashboardModelLayout title="Modifier un groupe" type="edit" onSubmit={handleSubmit}>
      <FormGroup>
        <Title level={2}>Informations générales</Title>

        <Input label="Nom" placeholder="Term1" value={name} setValue={setName} />

        <TagsInput label="Labels" placeholder="Labels" data={labels} values={groupLabels} addValue={addLabel} removeValue={removeLabel} />
      </FormGroup>
    </AdminDashboardModelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.user;

  try {
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== ROLES.ADMIN.PERMISSION) throw new Error();
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }

  try {
    const { data: group } = await database.get(`/api/groups/${context.query.id}`, getHeaders(token));
    if (!group) throw new Error();

    const { data: labels } = await database.get('/api/labels', getHeaders(token));
    if (!labels) throw new Error();

    const props: ServerSideProps = { group, labels, token };

    return { props };
  } catch (err) {
    return {
      redirect: {
        destination: '/admin/groups',
        permanent: false,
      },
    };
  }
};

export default Group;
