import React, { FunctionComponent, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

import Input from '@element/Input';
import Title from '@element/Title';

import Form from '@module/Form';

import AdminDashboardModelLayout from '@layout/AdminDashboardModel';

import { getHeaders } from '@util/authentication.utils';

import roles from '@constant/roles';

import database from 'database/database';
import FormGroup from '@module/FormGroup';
import Dropdown from '@element/Dropdown';
import Row from '@module/Row';
import TagsInput from '@element/TagsInput';

const User = ({ user, groups }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [username, setUsername] = useState(user.username);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);

  const [gender, setGender] = useState(user.gender === null ? 'null' : user.gender ? 'male' : 'female');
  const [role, setRole] = useState(user.role.name || 'student');
  const [userGroups, setUserGroups] = useState<Array<Group>>(user.groups);

  const addGroup = (group: Group): void => {
    setUserGroups((prev) => [...prev, group]);
  };

  const removeGroup = (group: Group): void => {
    setUserGroups((prev) => prev.filter((_group) => _group !== group));
  };

  const getRoleDropdownValues = (): DropdownValues => {
    return Object.values(roles).map(({ slug, name }) => ({ name: name.FR, slug }));
  };

  const getGenderDropdownValues = (): DropdownValues => {
    return [
      { name: 'Homme', slug: 'male' },
      { name: 'Femme', slug: 'female' },
      { name: 'Indéfini', slug: 'null' },
    ];
  };

  return (
    <AdminDashboardModelLayout active="Utilisateurs" title="Modifier un utilisateur" path="Utilisateurs > Modifier">
      <Form full={true}>
        <Row>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Nom d'utilisateur" placeholder="johndoe" value={username} setValue={setUsername} />
            <Input label="Prénom" placeholder="John" value={firstName} setValue={setFirstName} />
            <Input label="Nom de famille" placeholder="Doe" value={lastName} setValue={setLastName} />

            <Dropdown label="Sexe" placeholder="Indéfini" values={getGenderDropdownValues()} value={gender} setValue={setGender} />
          </FormGroup>

          <FormGroup>
            <Title level={2}>Informations supplémentaires</Title>

            <Dropdown label="Role" placeholder="Role" values={getRoleDropdownValues()} value={role} setValue={setRole} />

            <TagsInput<Group> label="Groupes" placeholder="Groupes" data={groups} values={userGroups} addValue={addGroup} removeValue={removeGroup} />
          </FormGroup>
        </Row>
      </Form>
    </AdminDashboardModelLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.user;

  try {
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== roles.ADMIN.PERMISSION) throw new Error();
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }

  try {
    const { data: user } = await database.get(`/api/users/${context.query.id}`, getHeaders(token));
    if (!user) throw new Error();

    const { data: groups } = await database.get('/api/groups', getHeaders(token));
    if (!groups) throw new Error();

    return { props: { user, groups } };
  } catch (err) {
    console.log(err);
    return { props: { user: null, groups: null } };
  }
};

export default User;
