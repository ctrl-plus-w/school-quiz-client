import React, { ReactElement, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

import { v4 as uuidv4 } from 'uuid';

import ProfessorDashboard from '@layout/ProfessorDashboard';

import Container from '@module/Container';
import Form from '@module/Form';
import FormGroup from '@module/FormGroup';

import Input from '@element/Input';
import Title from '@element/Title';
import RadioInput from '@element/RadioInput';
import CheckboxInput from '@element/CheckboxInput';
import MultipleTextInput from '@element/MultipleTextInput';
import MultipleNumberInput from '@element/MultipleNumberInput';
import Dropdown from '@element/Dropdown';
import NumberInput from '@element/NumberInput';
import EditableRadioInput from '@element/EditableRadioInput';
import EditableCheckboxInput from '@element/EditableCheckboxInput';

import { getHeaders } from '@util/authentication.utils';
import { nameSlugMapper, questionTypeFilter } from '@util/mapper.utils';

import ROLES from '@constant/roles';

import database from 'database/database';
import Row from '@module/Row';
import LinkButton from '@element/LinkButton';
import Button from '@element/Button';

interface IServerSideProps {
  quiz: IQuiz;
  questionSpecifications: Array<IQuestionSpecification>;
  token: string;
}

const CreateQuizQuestion = ({ quiz, questionSpecifications, token }: IServerSideProps): ReactElement => {
  const [valid, _setValid] = useState(false);

  // The basic question properties
  const [title, setTitle] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('numericQuestion');
  const [verificationType, setVerificationType] = useState<VerificationType>('automatique');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [accentSensitive, setAccentSensitive] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  // The amount of choice to create for a choice question
  const [choiceAmount, setChoiceAmount] = useState('2');

  // The choices of a choice question (radio)
  const [uniqueChoices, setUniqueChoices] = useState<EditableRadioInputValues>([
    { id: uuidv4(), name: '', checked: false },
    { id: uuidv4(), name: '', checked: false },
  ]);

  // The choices of a choice quetion (checkbox)
  const [multipleChoices, setMultipleChoices] = useState<EditableCheckboxInputValues>([
    { id: uuidv4(), name: '', checked: false },
    { id: uuidv4(), name: '', checked: false },
  ]);

  // When the amount of choice get updated, add a "blank" object to the choices, so the user can edit it
  useEffect(() => {
    const uniqueChoicesLength = uniqueChoices.length;
    const multipleChoicesLength = multipleChoices.length;

    if (parseInt(choiceAmount) > uniqueChoicesLength) setUniqueChoices((prev) => [...prev, { id: uuidv4(), name: '', checked: false }]);
    else if (parseInt(choiceAmount) < uniqueChoicesLength) setUniqueChoices((prev) => prev.slice(0, -1));

    if (parseInt(choiceAmount) > multipleChoicesLength) setMultipleChoices((prev) => [...prev, { id: uuidv4(), name: '', checked: false }]);
    else if (parseInt(choiceAmount) < multipleChoicesLength) setMultipleChoices((prev) => prev.slice(0, -1));
  }, [choiceAmount]);

  // The answers of the textual question and the numeric question
  // - On the numeric question, it store the answers here only if the nqSpecificationType is set to 'exact'.
  const [tqAnswers, setTqAnswers] = useState<string[]>([]);
  const [nqAnswers, setNqAnswers] = useState<string[]>([]);

  // The answer min and max of the numeric question when the nqSpecificationType is set to 'comparison'.
  const [nqAnswerMin, setNqAnswerMin] = useState('');
  const [nqAnswerMax, setNqAnswerMax] = useState('');

  // The numeric question specification type
  const [nqSpecificationType, setNqSpecificationType] = useState<'exact' | 'comparison'>('exact');

  // The question specifications of the numeric and choice question (fetched on the database and formatted).
  const [numericQuestionSpecifications] = useState(questionSpecifications.filter(questionTypeFilter('numericQuestion')).map(nameSlugMapper));
  const [choiceQuestionSpecifications] = useState(questionSpecifications.filter(questionTypeFilter('choiceQuestion')).map(nameSlugMapper));

  // The numeric and choice question specification
  const [nqSpecification, setNqSpecification] = useState(nameSlugMapper(numericQuestionSpecifications[0]).slug);
  const [cqSpecification, setCqSpecification] = useState(nameSlugMapper(choiceQuestionSpecifications[0]).slug);

  // When the creation properties of the question get updated, make calculation to see if it is valid or not
  useEffect(() => {
    // TODO : Edit the valid state depending on the given properties.
  }, [
    title,
    questionType,
    verificationType,
    caseSensitive,
    accentSensitive,
    shuffle,
    uniqueChoices,
    multipleChoices,
    tqAnswers,
    nqAnswerMax,
    nqAnswerMin,
    nqAnswerMax,
  ]);

  const handleSubmit = (): void => {
    // TODO : If the valid property is set to true, make the computations to create a quiz.
  };

  return (
    <ProfessorDashboard>
      <Container
        title="Créer une question"
        breadcrumb={[
          { name: 'Tests', path: '/professor/quizzes' },
          { name: quiz.title, path: `/professor/quizzes/${quiz.id}` },
          { name: 'Créer une question' },
        ]}
      >
        <hr className="mb-8 mt-8" />

        <Form full={true} onSubmit={handleSubmit}>
          <FormGroup>
            <Title level={2}>Informations générales</Title>

            <Input label="Titre" placeholder="Comment... ?" value={title} setValue={setTitle} />
          </FormGroup>

          <FormGroup>
            <Title level={2}>Type</Title>

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

            {questionType === 'textualQuestion' && (
              <>
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

                <CheckboxInput
                  label="Options supplémentaires"
                  values={[
                    { name: 'Sensible à la case', checked: caseSensitive, setValue: setCaseSensitive },
                    { name: 'Sensible aux accents', checked: accentSensitive, setValue: setAccentSensitive },
                  ]}
                />

                <MultipleTextInput label="Réponses" placeholder="Réponse" values={tqAnswers} setValues={setTqAnswers} />
              </>
            )}

            {questionType === 'numericQuestion' && (
              <>
                <Dropdown
                  label="Spécification"
                  placeholder="test"
                  values={numericQuestionSpecifications}
                  value={nqSpecification}
                  setValue={setNqSpecification}
                />

                {['nombre-entier', 'nombre-decimal', 'pourcentage', 'prix'].includes(nqSpecification) && (
                  <>
                    <Dropdown
                      label="Type de spécification"
                      placeholder="Type de spécification"
                      values={[
                        { name: 'Exact', slug: 'exact' },
                        { name: 'Comparaison', slug: 'comparison' },
                      ]}
                      value={nqSpecificationType}
                      setValue={setNqSpecificationType}
                    />

                    {nqSpecificationType === 'comparison' ? (
                      <Row className="w-80 justify-between">
                        <NumberInput label="Minimum" type={nqSpecification} value={nqAnswerMin} setValue={setNqAnswerMin} />
                        <NumberInput label="Maximum" type={nqSpecification} value={nqAnswerMax} setValue={setNqAnswerMax} />
                      </Row>
                    ) : (
                      <MultipleNumberInput label="Réponses" type={nqSpecification} values={nqAnswers} setValues={setNqAnswers} />
                    )}
                  </>
                )}

                {['date'].includes(nqSpecification) && (
                  <MultipleNumberInput label="Réponses" type={nqSpecification} values={nqAnswers} setValues={setNqAnswers} />
                )}
              </>
            )}

            {questionType === 'choiceQuestion' && (
              <>
                <Dropdown
                  label="Spécification"
                  placeholder="test"
                  values={choiceQuestionSpecifications}
                  value={cqSpecification}
                  setValue={setCqSpecification}
                />

                <CheckboxInput label="Option supplémentaire" values={[{ name: 'Mélanger les choix', checked: shuffle, setValue: setShuffle }]} />

                <NumberInput label="Nombre de réponses" type="nombre-entier" value={choiceAmount} setValue={setChoiceAmount} min={2} />

                {cqSpecification === 'choix-unique' ? (
                  <EditableRadioInput label="Choix" placeholder="Choix" values={uniqueChoices} setValues={setUniqueChoices} />
                ) : (
                  <EditableCheckboxInput label="Choix" placeholder="Choix" values={multipleChoices} setValues={setMultipleChoices} />
                )}
              </>
            )}
          </FormGroup>

          <div className="flex mt-auto ml-auto">
            <LinkButton href="/professor/quizzes" outline={true} className="mr-6">
              Annuler
            </LinkButton>

            <Button submit={true} disabled={!valid}>
              Créer
            </Button>
          </div>
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const token = context.req.cookies.user;

  try {
    if (!token) throw new Error();

    const { data: validatedTokenData } = await database.post('/auth/validateToken', {}, getHeaders(token));
    if (!validatedTokenData.valid) throw new Error();

    if (validatedTokenData.rolePermission !== ROLES.PROFESSOR.PERMISSION) throw new Error();

    const { data: questionSpecifications } = await database.get('/api/questionSpecifications', getHeaders(token));

    const { data: quiz } = await database.get(`/api/quizzes/${context.query.quizId}`, getHeaders(token));
    if (!quiz)
      return {
        redirect: {
          destination: `/professor/quizzes/${quiz.id}`,
          permanent: false,
        },
      };

    const props: IServerSideProps = { quiz, questionSpecifications, token };
    return { props };
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }
};

export default CreateQuizQuestion;
