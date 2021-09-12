import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import type { ReactElement } from 'react';

import React from 'react';

import AdminDashboardSkeleton from '@layout/AdminDashboardSkeleton ';
import AdminDashboard from '@layout/AdminDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Form from '@module/Form';
import Row from '@module/Row';

import SearchInput from '@element/SearchInput';
import Dropdown from '@element/Dropdown';
import Input from '@element/Input';
import Title from '@element/Title';
import Bar from '@element/Bar';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useValidation from '@hooks/useValidation';
import useLoadGroups from '@hooks/useLoadGroups';
import useLoadRoles from '@hooks/useLoadRoles';
import useLoadUser from '@hooks/useLoadUser';
import useLoading from '@hooks/useLoading';

import { genderMapper, nameSlugMapper } from '@util/mapper.utils';

import { selectGroups } from '@redux/groupSlice';
import { selectRoles } from '@redux/roleSlice';
import { selectToken } from '@redux/authSlice';
import { selectUser } from '@redux/userSlice';

import ROLES from '@constant/roles';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

const User = (): ReactElement => {
  const router = useRouter();

  const { id } = router.query;

  const { state: rolesState, run: runRoles } = useLoadRoles({ doNotRefetch: true });
  const { state: groupsState, run: runGroups } = useLoadGroups({ doNotRefetch: true });
  const { state: userState, run: runUser } = useLoadUser(parseInt(id as string));
  const { state: authState } = useAuthentication(ROLES.ADMIN.PERMISSION, [runUser, runGroups, runRoles]);

  const { loading } = useLoading([userState, authState, groupsState, rolesState]);

  const groups = useAppSelector(selectGroups);
  const token = useAppSelector(selectToken);
  const roles = useAppSelector(selectRoles);
  const user = useAppSelector(selectUser);

  const [formFilled, setFormFilled] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [gender, setGender] = useState('');

  const [role, setRole] = useState('');
  const [userGroups, setUserGroups] = useState<Array<IBasicModel>>([]);

  const { valid } = useValidation(
    () => false,
    [firstName, lastName, username, gender, role, userGroups],
    [firstName, lastName, username, gender, role]
  );

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setUsername(user.username);

    setUserGroups(user.groups.map(nameSlugMapper));

    if (typeof user.gender === 'boolean') {
      setGender(genderMapper(user.gender, true));
    }

    if (user.role) setRole(user.role.slug);

    setFormFilled(true);
  }, [user]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!valid || !token) return;

    //  TODO : Make the update user computations.

    alert(1);
  };

  return loading || !formFilled || !user ? (
    <AdminDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <Bar />

        <FormSkeleton full>
          <Row>
            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton />
              <InputSkeleton />
              <InputSkeleton />
              <InputSkeleton />
            </FormGroupSkeleton>

            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton />
              <InputSkeleton />
            </FormGroupSkeleton>
          </Row>
        </FormSkeleton>
      </ContainerSkeleton>
    </AdminDashboardSkeleton>
  ) : (
    <AdminDashboard>
      <Container
        title="Modifier un utilisateur"
        breadcrumb={[{ name: 'Utilisateurs', path: '/admin/users' }, { name: `${user.firstName} ${user.lastName}` }]}
      >
        <Bar />

        <Form onSubmit={handleSubmit} full>
          <Row>
            <FormGroup>
              <Title level={2}>Informations gérales</Title>

              <Input label="Prénom" setValue={setFirstName} value={firstName} placeholder="John" autofocus />
              <Input label="Nom" setValue={setLastName} value={lastName} placeholder="Doe" />
              <Input label="Nom d'utilisateur" setValue={setUsername} value={username} placeholder="jdoe" />

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

              <Dropdown label="Rôle" value={role} setValue={setRole} values={roles.map(nameSlugMapper)} placeholder="Rôle" />

              <SearchInput label="Groupes" data={groups.map(nameSlugMapper)} values={userGroups} setValues={setUserGroups} placeholder="Groupe" />
            </FormGroup>
          </Row>

          <FormButtons href="/admin/users" valid={valid} update />
        </Form>
      </Container>
    </AdminDashboard>
  );
};

export default User;
