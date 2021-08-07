import React, { Dispatch, FormEvent, ReactElement, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/dist/client/router';

import ProfessorDashboard from '@layout/ProfessorDashboard';

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
import LinkButton from '@element/LinkButton';
import Textarea from '@element/Textarea';
import Dropdown from '@element/Dropdown';
import Button from '@element/Button';
import Input from '@element/Input';
import Title from '@element/Title';

import { nameMapper, nameSlugMapper } from '@util/mapper.utils';
import { areArraysEquals } from '@util/condition.utils';
import { getHeaders } from '@util/authentication.utils';

import { choiceSorter, generateChoices, removeChoices } from 'helpers/question.helper';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';

import { addExactAnswers, removeExactAnswers, updateTextualQuestion } from 'api/questions';

import database from 'database/database';

import ROLES from '@constant/roles';

interface IQuestionDefaultFieldsProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;

  description: string;
  setDescription: Dispatch<SetStateAction<string>>;

  children?: ReactNode;
}

const QuestionDefaultFields = ({ title, setTitle, description, setDescription, children }: IQuestionDefaultFieldsProps): ReactElement => {
  return (
    <FormGroup>
      <Title level={2}>Informations générales</Title>

      <Input label="Titre" placeholder="Comment... ?" value={title} setValue={setTitle} maxLength={35} />

      <Textarea label="Description" placeholder="Lorem ipsum..." value={description} setValue={setDescription} maxLength={120} />

      {children}
    </FormGroup>
  );
};

interface IQuizDefaultButtonsProps {
  quiz: IQuiz;
  valid: boolean;
}

const QuizDefaultButtons = ({ quiz, valid }: IQuizDefaultButtonsProps) => {
  return (
    <div className="flex mt-auto ml-auto">
      <LinkButton href={`/professor/quizzes/${quiz.id}`} primary={false} className="mr-6">
        Annuler
      </LinkButton>

      <Button submit={true} disabled={!valid}>
        Modifier
      </Button>
    </div>
  );
};

interface ITextualQuestionProps extends IServerSideProps {
  question: IQuestion<ITextualQuestion>;
}

const TextualQuestion = ({ quiz, question, questionSpecifications, token }: ITextualQuestionProps): ReactElement => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [caseSensitive, setCaseSensitive] = useState(question.typedQuestion.caseSensitive);
  const [accentSensitive, setAccentSensitive] = useState(question.typedQuestion.accentSensitive);

  const questionVerificationType = question.typedQuestion.verificationType?.slug as VerificationType | undefined;
  const [verificationType, setVerificationType] = useState<VerificationType>(questionVerificationType || 'manuel');

  const questionAnswers = question.answers as Array<IAnswer<IExactAnswer>>;
  const questionAnswersContent = questionAnswers.map(({ typedAnswer }) => typedAnswer.answerContent);

  const [answers, setAnswers] = useState(questionAnswersContent);

  useEffect(() => {
    const isValid = (): boolean => {
      if (
        title === question.title &&
        description === question.description &&
        accentSensitive === question.typedQuestion.accentSensitive &&
        caseSensitive === question.typedQuestion.caseSensitive &&
        verificationType === questionVerificationType &&
        areArraysEquals(questionAnswersContent, answers)
      )
        return false;

      return true;
    };

    if (isValid()) setValid(true);
    else setValid(false);
  }, [title, description, verificationType, caseSensitive, accentSensitive, answers]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    // Update the question instance
    const updateAttributes: AllOptional<TextualQuestionCreationAttributes> = {
      title: title !== question.title ? title : undefined,
      description: description !== question.description ? description : undefined,
      accentSensitive: accentSensitive !== question.typedQuestion.accentSensitive ? accentSensitive : undefined,
      caseSensitive: caseSensitive !== question.typedQuestion.caseSensitive ? caseSensitive : undefined,
      verificationTypeSlug: questionVerificationType !== verificationType ? verificationType : undefined,
    };

    const [updated, updateQuestionError] = await updateTextualQuestion(quiz.id, question.id, updateAttributes, token);

    if (updateQuestionError) {
      if (updateQuestionError.status === 403) router.push('/login');
      else addNotification({ content: updateQuestionError.message, type: 'ERROR' });
    }

    if (!updated) return;

    // Update the question answers
    if (!areArraysEquals(questionAnswersContent, answers)) {
      const addedAnswers = answers.filter((answer) => !questionAnswersContent.includes(answer));
      const removedAnswers = questionAnswers.filter(({ typedAnswer }) => !answers.includes(typedAnswer.answerContent));

      if (addedAnswers.length > 0) {
        const addAnswerCreationAttributes: Array<ExactAnswerCreationAttributes> = addedAnswers.map((answer) => ({ answerContent: answer }));
        const [added, addedAnswersError] = await addExactAnswers(quiz.id, question.id, addAnswerCreationAttributes, token);

        if (addedAnswersError) {
          if (addedAnswersError.status === 403) router.push('/login');
          else addNotification({ content: addedAnswersError.message, type: 'ERROR' });
        }

        if (!added) return;
      }

      if (removedAnswers.length > 0) {
        const removeAnswersCreationAttributes: Array<number> = removedAnswers.map(({ id }) => id);
        const [removed, removedAnswersError] = await removeExactAnswers(quiz.id, question.id, removeAnswersCreationAttributes, token);

        if (removedAnswersError) {
          if (removedAnswersError.status === 403) router.push('/login');
          else addNotification({ content: removedAnswersError.message, type: 'ERROR' });
        }

        if (!removed) return;
      }
    }

    addNotification({ content: 'Question modifiée.', type: 'INFO' });
    router.push(`/professor/quizzes/${quiz.id}`);
  };

  return (
    <Form full={true} onSubmit={handleSubmit}>
      <Row wrap>
        <QuestionDefaultFields {...{ title, setTitle, description, setDescription }}>
          <MultipleTextInput label="Réponses" placeholder="Réponse" values={answers} setValues={setAnswers} maxLength={25} />
        </QuestionDefaultFields>

        <FormGroup>
          <Title level={2}>Options du type</Title>

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
        </FormGroup>
      </Row>

      <QuizDefaultButtons {...{ quiz, valid }} />
    </Form>
  );
};

interface INumericQuestionProps extends IServerSideProps {
  question: IQuestion<INumericQuestion>;
}

const NumericQuestion = ({ quiz, question, questionSpecifications, token }: INumericQuestionProps): ReactElement => {
  const questionAnswers = question.answers as Array<IAnswer<IExactAnswer>>;
  const questionAnswer = question.answers[0] as IAnswer<IComparisonAnswer>;

  const firstAnswerType = questionAnswer.answerType === 'exactAnswer' ? 'exact' : 'comparison';

  // Constants

  const [specifications] = useState(questionSpecifications.map(nameSlugMapper));
  const [questionSpecification] = useState(specifications.find(({ slug }) => slug === question.typedQuestion.questionSpecification?.slug)?.slug);

  const [questionAnswersContent] = useState(questionAnswers.map(({ typedAnswer }) => typedAnswer.answerContent));

  // States

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [specification, setSpecification] = useState(questionSpecification || 'nombre-entier');

  const [specificationType, setSpecificationType] = useState<'exact' | 'comparison'>(questionAnswer ? firstAnswerType : 'exact');

  const [answers, setAnswers] = useState(questionAnswersContent);

  const [questionAnswerMin] = useState(specificationType === 'comparison' ? questionAnswer?.typedAnswer?.greaterThan?.toString() : '');
  const [questionAnswerMax] = useState(specificationType === 'comparison' ? questionAnswer?.typedAnswer?.lowerThan?.toString() : '');

  const [answerMin, setAnswerMin] = useState(questionAnswerMin);
  const [answerMax, setAnswerMax] = useState(questionAnswerMax);

  useEffect(() => {
    const isValid = () => {
      if (title !== question.title || description !== question.description) return true;

      if (specificationType === 'exact') {
        if (areArraysEquals(questionAnswersContent, answers)) return false;
      }

      if (specificationType === 'comparison') {
        if (questionAnswerMin === answerMin && questionAnswerMax === answerMax) return false;
      }

      return true;
    };

    if (isValid()) setValid(true);
    else setValid(false);
  }, [title, description, answers, answerMin, answerMax]);

  const handleSubmit = (e: FormEvent): void => {
    alert();
  };

  return (
    <Form full={true} onSubmit={handleSubmit}>
      <Row wrap>
        <QuestionDefaultFields {...{ title, setTitle, description, setDescription }} />

        <FormGroup>
          <Title level={2}>Options du type</Title>

          <Dropdown label="Spécification" placeholder="test" values={specifications} value={specification} setValue={setSpecification} readonly />

          {['nombre-entier', 'nombre-decimal', 'pourcentage', 'prix'].includes(specification) && (
            <>
              <Dropdown
                label="Type de spécification"
                placeholder="Type de spécification"
                values={[
                  { name: 'Exact', slug: 'exact' },
                  { name: 'Comparaison', slug: 'comparison' },
                ]}
                value={specificationType}
                setValue={setSpecificationType}
                readonly
              />

              {specificationType === 'comparison' ? (
                <Row className="w-80">
                  <NumberInput label="Minimum" type={specification} value={answerMin} setValue={setAnswerMin} />
                  <NumberInput label="Maximum" type={specification} value={answerMax} setValue={setAnswerMax} />
                </Row>
              ) : (
                <MultipleNumberInput label="Réponses" type={specification} values={answers} setValues={setAnswers} />
              )}
            </>
          )}

          {['date'].includes(specification) && <MultipleNumberInput label="Réponses" type={specification} values={answers} setValues={setAnswers} />}
        </FormGroup>
      </Row>

      <QuizDefaultButtons {...{ quiz, valid }} />
    </Form>
  );
};

interface IChoiceQuestionProps extends IServerSideProps {
  question: IQuestion<IChoiceQuestion>;
}

const ChoiceQuestion = ({ quiz, question, questionSpecifications, token }: IChoiceQuestionProps): ReactElement => {
  const [specifications] = useState(questionSpecifications.map(nameSlugMapper));

  const getQuestionSpecification = () => {
    const questionSpecificationSlug = question.typedQuestion.questionSpecification?.slug;
    return specifications.find(({ slug }) => slug === questionSpecificationSlug);
  };

  const choiceMapper = (choices: Array<IChoice>): Array<EditableInputValue> => {
    return choices.map((choice, index) => ({ id: index, name: choice.name, checked: choice.valid, defaultName: choice.name }));
  };

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [shuffle, setShuffle] = useState(question.typedQuestion.shuffle);

  const [specification, setSpecification] = useState(getQuestionSpecification()?.slug || 'choix-unique');

  const [choiceAmount, setChoiceAmount] = useState(question.typedQuestion.choices.length.toString());

  const [uniqueChoices, setUniqueChoices] = useState(choiceMapper(question.typedQuestion.choices));
  const [multipleChoices, setMultipleChoices] = useState(choiceMapper(question.typedQuestion.choices));

  useEffect(() => {
    const isValid = (): boolean => {
      const choices = specification === 'choix-unique' ? uniqueChoices : multipleChoices;

      const questionChoicesName = question.typedQuestion.choices.map(({ name }) => name);
      const choicesName = choices.map(({ name }) => name);

      const questionCheckedChoices = question.typedQuestion.choices.filter(({ valid }) => valid).map(nameMapper);
      const checkedChoices = choices.filter(({ checked }) => checked).map(nameMapper);

      if (
        title === question.title &&
        description === question.description &&
        shuffle === question.typedQuestion.shuffle &&
        areArraysEquals(questionChoicesName, choicesName, choiceSorter) &&
        areArraysEquals(questionCheckedChoices, checkedChoices, choiceSorter)
      )
        return false;

      const isOneChecked = choices.some(({ checked }) => checked === true);
      const areValuesNotEmpty = choices.every(({ name }) => name !== '');

      if (uniqueChoices.length < 2 || !isOneChecked || !areValuesNotEmpty) return false;

      return true;
    };

    if (isValid()) setValid(true);
    else setValid(false);
  }, [title, description, shuffle, uniqueChoices, multipleChoices]);

  useEffect(() => {
    const choicesLength = specification === 'choix-unique' ? uniqueChoices.length : multipleChoices.length;
    const setterFunction = specification === 'choix-unique' ? setUniqueChoices : setMultipleChoices;

    if (parseInt(choiceAmount) > choicesLength) {
      setterFunction((prev) => generateChoices(parseInt(choiceAmount) - choicesLength, prev));
    }

    if (parseInt(choiceAmount) < choicesLength) {
      setterFunction((prev) => removeChoices(-(choicesLength - parseInt(choiceAmount)), prev));
    }
  }, [choiceAmount]);

  const handleSubmit = (e: FormEvent): void => {
    alert();
  };

  return (
    <Form full={true} onSubmit={handleSubmit}>
      <Row wrap>
        <QuestionDefaultFields {...{ title, setTitle, description, setDescription }} />

        <FormGroup>
          <Title level={2}>Options du type</Title>

          <Dropdown label="Spécification" placeholder="test" values={specifications} value={specification} setValue={setSpecification} readonly />

          <CheckboxInput label="Option supplémentaire" values={[{ name: 'Mélanger les choix', checked: shuffle, setValue: setShuffle }]} />

          <NumberInput label="Nombre de réponses" type="nombre-entier" value={choiceAmount} setValue={setChoiceAmount} min={2} />

          {specification === 'choix-unique' ? (
            <EditableRadioInput label="Choix" placeholder="Choix" values={uniqueChoices} setValues={setUniqueChoices} maxLength={35} />
          ) : (
            <EditableCheckboxInput label="Choix" placeholder="Choix" values={multipleChoices} setValues={setMultipleChoices} maxLength={35} />
          )}
        </FormGroup>
      </Row>

      <QuizDefaultButtons {...{ quiz, valid }} />
    </Form>
  );
};

interface IServerSideProps {
  quiz: IQuiz;
  question: Question;
  questionSpecifications: Array<IQuestionSpecification>;
  token: string;
}

const Question = ({ quiz, question, questionSpecifications, token }: IServerSideProps): ReactElement => {
  const getComponent = (): ReactElement => {
    const textualQuestion = question as IQuestion<ITextualQuestion>;
    const numericQuestion = question as IQuestion<INumericQuestion>;
    const choiceQuestion = question as IQuestion<IChoiceQuestion>;

    const props = { quiz, questionSpecifications, token };

    switch (question.questionType) {
      case 'numericQuestion':
        return <NumericQuestion {...props} question={numericQuestion} />;

      case 'textualQuestion':
        return <TextualQuestion {...props} question={textualQuestion} />;

      case 'choiceQuestion':
        return <ChoiceQuestion {...props} question={choiceQuestion} />;

      default:
        return <></>;
    }
  };

  return (
    <ProfessorDashboard>
      <Container
        title="Modifier une question"
        breadcrumb={[
          { name: 'Tests', path: '/professor/quizzes' },
          { name: quiz.title, path: `/professor/quizzes/${quiz.id}` },
          { name: 'Modifier une question' },
        ]}
      >
        <hr className="mt-8 mb-8" />

        {getComponent()}
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

    const { data: quiz } = await database.get(`/api/quizzes/${context.query.quizId}`, getHeaders(token));
    const { data: question } = await database.get(`/api/quizzes/${context.query.quizId}/questions/${context.query.questionId}`, getHeaders(token));

    if (!question)
      return {
        redirect: {
          destination: `/professor/quizzes/${question.id}`,
          permanent: false,
        },
      };

    const { data: questionSpecifications } = await database.get('/api/questionSpecifications', {
      params: { questionType: question.questionType },
      ...getHeaders(token),
    });

    const props: IServerSideProps = { quiz, question, questionSpecifications, token };
    return { props };
  } catch (err) {
    return { redirect: { destination: '/', permanent: false } };
  }
};

export default Question;
