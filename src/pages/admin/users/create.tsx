import React from 'react';

import type { FormEvent, ReactElement } from 'react';

import { useState } from 'react';

import AdminDashboard from '@layout/AdminDashboard';
import AdminDashboardSkeleton from '@layout/AdminDashboardSkeleton ';

import FormButtons from '@module/FormButtons';
import Container from '@module/Container';
import FormGroup from '@module/FormGroup';
import Form from '@module/Form';
import Row from '@module/Row';

import PasswordInput from '@element/PasswordInput';
import SearchInput from '@element/SearchInput';
import Dropdown from '@element/Dropdown';
import Title from '@element/Title';
import Input from '@element/Input';
import Bar from '@element/Bar';

import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadGroups from '@hooks/useLoadGroups';
import useValidation from '@hooks/useValidation';
import useLoadRoles from '@hooks/useLoadRoles';
import useLoading from '@hooks/useLoading';

import { nameSlugMapper } from '@util/mapper.utils';

import { selectGroups } from '@redux/groupSlice';
import { selectRoles } from '@redux/roleSlice';

import ROLES from '@constant/roles';
import { selectToken } from '@redux/authSlice';

const CreateUser = (): ReactElement => {
  const { state: rolesState, run: runRoles } = useLoadRoles();
  const { state: groupsState, run: runGroups } = useLoadGroups();
  const { state: authState } = useAuthentication(ROLES.ADMIN.PERMISSION, [runGroups, runRoles]);

  const { loading } = useLoading([authState, groupsState, rolesState]);

  const token = useAppSelector(selectToken);
  const roles = useAppSelector(selectRoles);
  const groups = useAppSelector(selectGroups);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [gender, setGender] = useState('');

  const [userRole, setUserRole] = useState('');
  const [userGroups, setUserGroups] = useState<Array<IBasicModel>>([]);

  const { valid } = useValidation(() => false, [firstName, lastName, username, userRole, gender], [firstName, lastName, username, userRole, gender]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!valid || !token) return;

    //  TODO : Make the create user computations.

    alert(1);
  };

  return loading ? (
    <AdminDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <Bar />

        <FormSkeleton full>
          <Row>
            <FormGroupSkeleton>
              <TitleSkeleton />

              <InputSkeleton />
              <InputSkeleton />
              <InputSkeleton />
              <InputSkeleton />
              <InputSkeleton />
            </FormGroupSkeleton>

            <FormGroupSkeleton>
              <TitleSkeleton />

              <InputSkeleton />
              <InputSkeleton />
            </FormGroupSkeleton>
          </Row>

          <FormButtonsSkeleton />
        </FormSkeleton>
      </ContainerSkeleton>
    </AdminDashboardSkeleton>
  ) : (
    <AdminDashboard>
      <Container title="Créer un utilisateur" breadcrumb={[{ name: 'Utilisateurs', path: '/admin/users' }, { name: 'Créer un utilisateur' }]}>
        <Bar />

        <Form full onSubmit={handleSubmit}>
          <Row wrap>
            <FormGroup>
              <Title level={2}>Informations générales</Title>

              <Input label="Prénom" setValue={setFirstName} value={firstName} placeholder="John" autofocus />
              <Input label="Nom" setValue={setLastName} value={lastName} placeholder="Doe" />
              <Input label="Nom d'utilisateur" setValue={setUsername} value={username} placeholder="jdoe" />

              <PasswordInput label="Mot de passe" setValue={setPassword} value={password} placeholder="****" generator={true} />

              <Dropdown
                label="Sexe"
                value={gender}
                setValue={setGender}
                placeholder="Indéfini"
                values={[
                  { name: 'Homme', slug: 'homme' },
                  { name: 'Femme', slug: 'femme' },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <Title level={2}>Informations supplémentaires</Title>

              <Dropdown label="Role" value={userRole} setValue={setUserRole} placeholder="Rôle" values={roles.map(nameSlugMapper)} />

              <SearchInput label="Groupes" data={groups.map(nameSlugMapper)} setValues={setUserGroups} values={userGroups} />
            </FormGroup>
          </Row>

          <FormButtons href="/admin/users" valid={valid} />
        </Form>
      </Container>
    </AdminDashboard>
  );
};

export default CreateUser;
