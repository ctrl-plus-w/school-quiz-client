import React, { FormEvent, FunctionComponent, useContext, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/dist/client/router';

import { v4 as uuidv4 } from 'uuid';

import Input from '@element/Input';
import Title from '@element/Title';
import Button from '@element/Button';
import LinkButton from '@element/LinkButton';
import Loader from '@element/Loader';

import Form from '@module/Form';
import FormGroup from '@module/FormGroup';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import { getHeaders } from '@util/authentication.utils';

import ROLES from '@constant/roles';

import database from 'database/database';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';
import TagsInput from '@element/TagsInput';

const Group: FunctionComponent = ({ group, labels, token }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(false);

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
      setLoading(true);

      if (groupLabels !== group.labels) {
        const newLabels = groupLabels.filter((label) => !group.labels.includes(label));
        const newLabelsIds = newLabels.map(({ id }) => id);

        await database.post(`/api/groups/${group.id}/labels`, { labelIds: newLabelsIds }, getHeaders(token));
      }

      if (name !== group.name) {
        await database.put(`/api/groups/${group.id}`, { name }, getHeaders(token));
      }
    } catch (err: any) {
      if (err.response && err.response.status === 403) return router.push('/login');
      else console.log(err.response);
    } finally {
      setLoading(false);
      addNotification({ content: 'Groupe modifié.', type: 'INFO' });

      router.push('/admin/groups');
    }
  };

  return (
    <>
      <AdminDashboardModelLayout active="Groupes" title="Modifier un groupe" path="Groupes > Modifier">
        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Nom" placeholder="Term1" value={name} setValue={setName} />

            <TagsInput label="Labels" placeholder="Labels" data={labels} values={groupLabels} addValue={addLabel} removeValue={removeLabel} />
          </FormGroup>

          <div className="flex mt-auto ml-auto">
            <LinkButton href="/admin/groups" outline={true} className="mr-6">
              Annuler
            </LinkButton>

            <Button submit={true}>Modifier</Button>
          </div>
        </Form>

        <Loader show={loading} />
      </AdminDashboardModelLayout>
    </>
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

    return { props: { group, labels, token } };
  } catch (err) {
    return { props: { group: null, labels: null, token } };
  }
};

export default Group;
