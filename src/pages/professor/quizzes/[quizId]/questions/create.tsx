import { FormEvent, ReactElement, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import Container from '@module/Container';
import FormGroup from '@module/FormGroup';
import Form from '@module/Form';
import Row from '@module/Row';

import EditableCheckboxInput from '@element/EditableCheckboxInput';
import MultipleNumberInput from '@element/MultipleNumberInput';
import EditableRadioInput from '@element/EditableRadioInput';
import MultipleTextInput from '@element/MultipleTextInput';
import CheckboxInput from '@element/CheckboxInput';
import NumberInput from '@element/NumberInput';
import RadioInput from '@element/RadioInput';
import Dropdown from '@element/Dropdown';
import Textarea from '@element/Textarea';
import Input from '@element/Input';
import Title from '@element/Title';

import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import CheckboxInputSkeleton from '@skeleton/CheckboxInputSkeleton';
import RadioInputSkeleton from '@skeleton/RadioInputSkeleton';

import useLoadSpecifications from '@hooks/useLoadSpecifications';
import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoadQuiz from '@hooks/useLoadQuiz';

import { isNull, nameSlugMapper, parseExactAnswer, parseNumericAnswer, questionTypeFilter } from '@util/mapper.utils';
import { isOneLoading } from '@util/condition.utils';

import { generateChoices, removeChoices } from '@helpers/question.helper';

import { addChoices, addComparisonAnswer, addExactAnswers, createChoiceQuestion, createNumericQuestion, createTextualQuestion } from '@api/questions';

import { NotificationContext } from '@notificationContext/NotificationContext';

import { selectSpecifications } from '@redux/questionSlice';
import { selectTempQuiz } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';

const CreateQuizQuestion = (): ReactElement => {
  const router = useRouter();

  const { quizId } = router.query;

  const { state: specificationState, run: runSpecification } = useLoadSpecifications();
  const { state: quizState, run: runQuiz } = useLoadQuiz(parseInt(quizId as string));
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runQuiz, runSpecification]);

  const token = useAppSelector(selectToken);
  const quiz = useAppSelector(selectTempQuiz);
  const questionSpecifications = useAppSelector(selectSpecifications);

  const { addNotification } = useContext(NotificationContext);

  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    setLoading(isOneLoading([specificationState, quizState, authState]) || isNull(quiz));
  }, [specificationState, quizState, authState]);

  // The basic question properties
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questionType, setQuestionType] = useState<QuestionType>('choiceQuestion');
  const [verificationType, setVerificationType] = useState<VerificationType>('automatique');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [accentSensitive, setAccentSensitive] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  // The amount of choice to create for a choice question
  const [choiceAmount, setChoiceAmount] = useState('2');

  // The choices of a choice question (radio)
  const [uniqueChoices, setUniqueChoices] = useState<Array<EditableInputValue>>(generateChoices(2));

  // The choices of a choice quetion (checkbox)
  const [multipleChoices, setMultipleChoices] = useState<Array<EditableInputValue>>(generateChoices(2));

  // When the amount of choice get updated, add a "blank" object to the choices, so the user can edit it
  useEffect(() => {
    const choicesLength = cqSpecification === 'choix-unique' ? uniqueChoices.length : multipleChoices.length;
    const setterFunction = cqSpecification === 'choix-unique' ? setUniqueChoices : setMultipleChoices;

    if (parseInt(choiceAmount) > choicesLength) {
      setterFunction((prev) => generateChoices(parseInt(choiceAmount) - choicesLength, prev));
    }

    if (parseInt(choiceAmount) < choicesLength) {
      setterFunction((prev) => removeChoices(-(choicesLength - parseInt(choiceAmount)), prev));
    }
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
  const [nqSpecifications, setNqSpecifications] = useState<Array<IBasicModel>>([]);
  const [cqSpecifications, setCqSpecifications] = useState<Array<IBasicModel>>([]);

  // The numeric and choice question specification
  const [nqSpecification, setNqSpecification] = useState('');
  const [cqSpecification, setCqSpecification] = useState('');

  useEffect(() => {
    if (!questionSpecifications) return;

    setNqSpecifications(() => {
      const filteredSpecifications = questionSpecifications.filter(questionTypeFilter('numericQuestion')).map(nameSlugMapper);

      if (filteredSpecifications.length > 0) setNqSpecification(filteredSpecifications[0].slug);

      return filteredSpecifications;
    });

    setCqSpecifications(() => {
      const filteredSpecifications = questionSpecifications.filter(questionTypeFilter('choiceQuestion')).map(nameSlugMapper);

      if (filteredSpecifications.length > 0) setCqSpecification(filteredSpecifications[0].slug);

      return filteredSpecifications;
    });
  }, [questionSpecifications]);

  // When the creation properties of the question get updated, make calculation to see if it is valid or not
  useEffect(() => {
    const isValid = (): boolean => {
      if (title === '' || description === '') return false;

      // Textual question
      if (questionType === 'textualQuestion' && tqAnswers.length === 0) return false;

      // Numeric question
      if (questionType === 'numericQuestion') {
        if (nqSpecificationType === 'exact') {
          if (nqAnswers.length === 0) return false;
        }

        if (nqSpecificationType === 'comparison') {
          if (nqAnswerMin === '' || nqAnswerMax === '') return false;
        }
      }

      // Choice question
      if (questionType === 'choiceQuestion') {
        const choices = cqSpecification === 'choix-unique' ? uniqueChoices : multipleChoices;

        if (cqSpecification !== 'choix-unique' && nqAnswerMin >= nqAnswerMax) return false;

        const isOneChecked = choices.some(({ checked }) => checked === true);
        const areValuesNotEmpty = choices.every(({ name }) => name !== '');

        if (uniqueChoices.length < 2 || !isOneChecked || !areValuesNotEmpty) return false;
      }

      return true;
    };

    if (isValid()) setValid(true);
    else setValid(false);
  }, [title, uniqueChoices, multipleChoices, cqSpecification, tqAnswers, nqAnswers, nqAnswerMin, nqAnswerMax]);

  const textualQuestionComputations = async (): Promise<void> => {
    if (!quiz || !token) return;

    const verificationTypeSlug = verificationType;
    const creationAttributes: TextualQuestionCreationAttributes = { title, description, accentSensitive, caseSensitive, verificationTypeSlug };

    const [question, questionCreationError] = await createTextualQuestion<Question>(quiz.id, creationAttributes, token);

    if (questionCreationError) {
      if (questionCreationError.status === 403) router.push('/login');
      else addNotification({ content: questionCreationError.message, type: 'ERROR' });
    }

    if (!question) return;

    const answers: Array<ExactAnswerCreationAttributes> = tqAnswers.map((answer) => ({ answerContent: answer }));
    const [createdAnswers, answersCreationError] = await addExactAnswers(quiz.id, question.id, answers, token);

    if (answersCreationError) {
      if (answersCreationError.status === 403) router.push('/login');
      else addNotification({ content: answersCreationError.message, type: 'ERROR' });
    }

    if (!createdAnswers) return;

    addNotification({ content: 'Question créée.', type: 'INFO' });
    router.push(`/professor/quizzes/${quiz.id}`);
  };

  const numericQuestionComputations = async (): Promise<void> => {
    if (!quiz || !token) return;

    const questionSpecificationSlug = nqSpecification;
    const creationAttributes: NumericQuestionCreationAttributes = { title, description, questionSpecificationSlug };

    const [question, questionCreationError] = await createNumericQuestion<Question>(quiz.id, creationAttributes, token);

    if (questionCreationError) {
      if (questionCreationError.status === 403) router.push('/login');
      else addNotification({ content: questionCreationError.message, type: 'ERROR' });
    }

    if (!question) return;

    if (nqSpecificationType === 'exact') {
      const answers: Array<ExactAnswerCreationAttributes> = nqAnswers.map((answer) => ({
        answerContent: parseExactAnswer(answer, questionSpecificationSlug),
      }));

      const [createdAnswers, answersCreationError] = await addExactAnswers(quiz.id, question.id, answers, token);

      if (answersCreationError) {
        if (answersCreationError.status === 403) router.push('/login');
        else addNotification({ content: answersCreationError.message, type: 'ERROR' });
      }

      if (!createdAnswers) return;
    } else {
      const answer: ComparisonAnswerCreationAttributes = {
        greaterThan: parseNumericAnswer(nqAnswerMin, questionSpecificationSlug),
        lowerThan: parseNumericAnswer(nqAnswerMax, questionSpecificationSlug),
      };

      const [createdAnswer, answerCreationError] = await addComparisonAnswer(quiz.id, question.id, answer, token);

      if (answerCreationError) {
        if (answerCreationError.status === 403) router.push('/login');
        else addNotification({ content: answerCreationError.message, type: 'ERROR' });
      }

      if (!createdAnswer) return;
    }

    addNotification({ content: 'Question créée.', type: 'INFO' });
    router.push(`/professor/quizzes/${quiz.id}`);
  };

  const choiceQuestionComputations = async (): Promise<void> => {
    if (!quiz || !token) return;

    const questionSpecificationSlug = cqSpecification;
    const creationAttributes: ChoiceQuestionCreationAttributes = { title, description, shuffle, questionSpecificationSlug };

    const [question, questionCreationError] = await createChoiceQuestion<Question>(quiz.id, creationAttributes, token);

    if (questionCreationError) {
      if (questionCreationError.status === 403) router.push('/login');
      else addNotification({ content: questionCreationError.message, type: 'ERROR' });
    }

    if (!question) return;

    const questionChoices = cqSpecification === 'choix-unique' ? uniqueChoices : multipleChoices;
    const [choices, choicesCreationError] = await addChoices(quiz.id, question.id, questionChoices, token);

    if (choicesCreationError) {
      if (choicesCreationError.status === 403) router.push('/login');
      else addNotification({ content: choicesCreationError.message, type: 'ERROR' });
    }

    if (!choices) return;

    addNotification({ content: 'Question créée.', type: 'INFO' });
    router.push(`/professor/quizzes/${quiz.id}`);
  };

  // Call the right function to create the question
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    if (questionType === 'choiceQuestion') choiceQuestionComputations();
    if (questionType === 'numericQuestion') numericQuestionComputations();
    if (questionType === 'textualQuestion') textualQuestionComputations();
  };

  return loading || !quiz ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <hr className="mb-8 mt-8" />

        <FormSkeleton full>
          <Row wrap>
            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton maxLength />
              <InputSkeleton textArea maxLength />

              <RadioInputSkeleton amount={3} big />
            </FormGroupSkeleton>

            <FormGroupSkeleton>
              <TitleSkeleton level={2} />

              <InputSkeleton />

              <CheckboxInputSkeleton amount={1} />

              <InputSkeleton />

              <RadioInputSkeleton />
            </FormGroupSkeleton>
          </Row>
        </FormSkeleton>
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
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
          <Row wrap>
            <FormGroup>
              <Title level={2}>Informations générales</Title>

              <Input label="Titre" placeholder="Comment... ?" value={title} setValue={setTitle} maxLength={35} />

              <Textarea label="Description" placeholder="Lorem ipsum..." value={description} setValue={setDescription} maxLength={120} />

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
            </FormGroup>

            <FormGroup>
              <Title level={2}>Options du type</Title>

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

                  <MultipleTextInput label="Réponses" placeholder="Réponse" values={tqAnswers} setValues={setTqAnswers} maxLength={25} />
                </>
              )}

              {questionType === 'numericQuestion' && (
                <>
                  <Dropdown
                    label="Spécification"
                    placeholder="test"
                    values={nqSpecifications}
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
                          <NumberInput
                            label="Minimum"
                            type={nqSpecification}
                            value={nqAnswerMin}
                            setValue={setNqAnswerMin}
                            error={nqAnswerMin > nqAnswerMax}
                          />
                          <NumberInput
                            label="Maximum"
                            type={nqSpecification}
                            value={nqAnswerMax}
                            setValue={setNqAnswerMax}
                            error={nqAnswerMax < nqAnswerMin}
                          />
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
                    values={cqSpecifications}
                    value={cqSpecification}
                    setValue={setCqSpecification}
                  />

                  <CheckboxInput label="Option supplémentaire" values={[{ name: 'Mélanger les choix', checked: shuffle, setValue: setShuffle }]} />

                  <NumberInput label="Nombre de réponses" type="nombre-entier" value={choiceAmount} setValue={setChoiceAmount} min={2} />

                  {cqSpecification === 'choix-unique' ? (
                    <EditableRadioInput label="Choix" placeholder="Choix" values={uniqueChoices} setValues={setUniqueChoices} maxLength={35} />
                  ) : (
                    <EditableCheckboxInput label="Choix" placeholder="Choix" values={multipleChoices} setValues={setMultipleChoices} maxLength={35} />
                  )}
                </>
              )}
            </FormGroup>
          </Row>

          <FormButtons href={`/professor/quizzes/${quiz.id}`} valid={valid} />
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};
export default CreateQuizQuestion;
