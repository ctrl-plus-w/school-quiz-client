import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';

import type { FormEvent, ReactElement } from 'react';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Form from '@module/Form';

import CheckboxInput from '@element/CheckboxInput';
import Textarea from '@element/Textarea';
import Input from '@element/Input';
import Title from '@element/Title';

import CheckboxInputSkeleton from '@skeleton/CheckboxInputSkeleton';
import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';

import { createQuiz } from '@api/quizzes';

import useAppDispatch from '@hooks/useAppDispatch';

import { addErrorNotification, addInfoNotification } from '@redux/notificationSlice';

import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';

const CreateQuiz = (): ReactElement => {
  const { state } = useAuthentication(ROLES.PROFESSOR.PERMISSION);

  const token = useAppSelector(selectToken);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [strict, setStrict] = useState(true);
  const [shuffle, setShuffle] = useState(true);

  useEffect(() => {
    if (title !== '' && description !== '') {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [title, description]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid || !token) return;

    const [created, error] = await createQuiz({ title, description, strict, shuffle }, token);

    if (error) {
      if (error.status === 403) router.push('/login');
      else dispatch(addErrorNotification(error.message));
    }

    if (!created) return;

    dispatch(addInfoNotification('Test créé.'));
    router.push('/professor/quizzes');
  };

  return state === 'LOADING' ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <hr className="mb-8 mt-8" />

        <FormSkeleton full>
          <FormGroupSkeleton>
            <TitleSkeleton level={2} />

            <InputSkeleton maxLength />
            <InputSkeleton textArea maxLength />
            <CheckboxInputSkeleton />
          </FormGroupSkeleton>

          <FormButtonsSkeleton />
        </FormSkeleton>
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container title="Créer un test" breadcrumb={[{ name: 'Tests', path: '/professor/quizzes' }, { name: 'Créer un test' }]}>
        <hr className="mb-8 mt-8" />

        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Titre" placeholder="Comment... ?" value={title} setValue={setTitle} maxLength={25} />

            <Textarea label="Description" placeholder="Lorem ipsum dolo..." value={description} setValue={setDescription} maxLength={120} />

            <CheckboxInput
              label="Options supplémentaires"
              values={[
                { name: 'Mode strict', checked: strict, setValue: setStrict },
                { name: 'Mélanger les questions', checked: shuffle, setValue: setShuffle },
              ]}
            />
          </FormGroup>

          <FormButtons href="/professor/quizzes" valid={valid} />
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export default CreateQuiz;
