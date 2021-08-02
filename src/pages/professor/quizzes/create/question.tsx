import React, { ReactElement, useState } from 'react';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import Container from '@module/Container';
import Form from '@module/Form';
import FormGroup from '@module/FormGroup';

import Input from '@element/Input';
import Title from '@element/Title';
import RadioInput from '@element/RadioInput';
import CheckboxInput from '@element/CheckboxInput';

const CreateQuizQuestion = (): ReactElement => {
  const [title, setTitle] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('textualQuestion');
  const [verificationType, setVerificationType] = useState<VerificationType>('automatique');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [accentSensitive, setAccentSensitive] = useState(false);

  const handleSubmit = (): void => {
    alert();
  };

  return (
    <ProfessorDashboard>
      <Container title="Créer un test" breadcrumb={[{ name: 'Tests', path: '/professor/quizzes' }, { name: 'Créer un test' }]}>
        <hr className="mb-8 mt-8" />

        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Titre" placeholder="Comment... ?" value={title} setValue={setTitle} />

            <CheckboxInput
              label="Options supplémentaires"
              values={[
                { name: 'Sensible à la case', checked: caseSensitive, setValue: setCaseSensitive },
                { name: 'Sensible aux accents', checked: accentSensitive, setValue: setAccentSensitive },
              ]}
            />
          </FormGroup>

          <FormGroup>
            <Title level={2}>Spécifications</Title>

            <RadioInput<QuestionType>
              label="Type de question"
              values={[
                { name: 'Abc', slug: 'textualQuestion' },
                { name: '123', slug: 'numericQuestion' },
                { name: 'ooo', slug: 'choiceQuestion' },
              ]}
              value={questionType}
              setValue={setQuestionType}
              big={true}
            />

            <RadioInput<VerificationType>
              label="Type de vérification"
              values={[
                { name: 'Automatique', slug: 'automatique' },
                { name: 'Hybride', slug: 'hybride' },
                { name: 'Manuel', slug: 'manuel' },
              ]}
              value={verificationType}
              setValue={setVerificationType}
            />
          </FormGroup>
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export default CreateQuizQuestion;
