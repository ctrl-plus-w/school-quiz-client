import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import type { FormEvent, ReactElement } from 'react';

import React from 'react';

import StudentDashboardSkeleton from '@layout/StudentDashboardSkeleton';
import StudentDashboard from '@layout/StudentDashboard';

import FormGroup from '@module/FormGroup';
import Container from '@module/Container';

import CheckboxInputGroup from '@element/CheckboxInputGroup';
import CalendarInput from '@element/CalendarInput';
import NumberInput from '@element/NumberInput';
import RadioInput from '@element/RadioInput';
import Button from '@element/Button';
import Input from '@element/Input';
import Form from '@module/Form';
import Bar from '@element/Bar';

import RadioInputSkeleton from '@skeleton/RadioInputSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ButtonSkeleton from '@skeleton/ButtonSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import useLoadStudentQuestion from '@hooks/useLoadStudentQuestion';
import useLoadStudentEvent from '@hooks/useLoadStudentEvent';
import useAuthentication from '@hooks/useAuthentication';
import useWindowFocus from '@hooks/useWindowFocus';
import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import useValidation from '@hooks/useValidation';
import useLoading from '@hooks/useLoading';

import { nameMapper, nameSlugMapper, shuffle, sortById } from '@util/mapper.utils';

import { answerQuestion } from '@api/questions';

import { addErrorNotification } from '@redux/notificationSlice';
import { selectTempQuiz, setTempQuiz } from '@redux/quizSlice';
import { selectTempQuestion } from '@redux/questionSlice';
import { selectTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';

interface ITextualQuestionProps {
  question: IQuestion<ITextualQuestion>;
  handleSubmit: (answerOrAnswers: { answer: string } | { answers: Array<string> }) => Promise<void>;
}

const TextualQuestion = ({ handleSubmit }: ITextualQuestionProps): ReactElement => {
  const [answer, setAnswer] = useState('');

  const { valid } = useValidation(() => true, [answer], [answer]);

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    handleSubmit({ answer });
  };

  return (
    <Form onSubmit={onSubmit} full>
      <FormGroup>
        <Input label="Réponse" value={answer} setValue={setAnswer} placeholder="Hello World" />
      </FormGroup>

      <div className="flex ml-auto mt-auto">
        <Button type="success" disabled={!valid} submit>
          Valider
        </Button>
      </div>
    </Form>
  );
};

interface INumericQuestionProps {
  question: IQuestion<INumericQuestion>;
  handleSubmit: (answerOrAnswers: { answer: string } | { answers: Array<string> }) => Promise<void>;
}

const NumericQuestion = ({ question, handleSubmit }: INumericQuestionProps): ReactElement => {
  const [specification] = useState(question.typedQuestion.questionSpecification);

  const [answer, setAnswer] = useState('');
  const [dateAnswer, setDateAnswer] = useState(new Date());

  const { valid } = useValidation(() => true, [answer], [answer]);

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    handleSubmit(specification?.slug === 'date' ? { answer: dateAnswer.valueOf().toString() } : { answer });
  };

  const getInput = (): ReactElement => {
    const defaultInput = <NumberInput label="Réponse" value={answer} setValue={setAnswer} placeholder="00" type="nombre-entier" />;

    if (!specification) return defaultInput;

    if (['nombre-entier', 'nombre-decimal', 'pourcentage', 'prix'].includes(specification.slug))
      return <NumberInput label="Réponse" value={answer} setValue={setAnswer} placeholder="00" type={specification.slug} />;

    if (specification.slug === 'date') return <CalendarInput label="réponse" value={dateAnswer} setValue={setDateAnswer} />;

    return defaultInput;
  };

  return (
    <Form onSubmit={onSubmit} full>
      <FormGroup>{getInput()}</FormGroup>

      <div className="flex ml-auto mt-auto">
        <Button type="success" disabled={!valid} submit>
          Valider
        </Button>
      </div>
    </Form>
  );
};

interface IChoiceQuestionProps {
  question: IQuestion<IChoiceQuestion>;
  handleSubmit: (answerOrAnswers: { answer: string } | { answers: Array<string> }) => Promise<void>;
}

const ChoiceQuestion = ({ question, handleSubmit }: IChoiceQuestionProps): ReactElement => {
  const [choices] = useState(shuffle(question.typedQuestion.choices));
  const [specification] = useState(question.typedQuestion.questionSpecification);

  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<Array<string>>([]);

  const { valid } = useValidation(
    () => {
      if (specification && specification.slug === 'choix-multiple' && answers.length === 0) return false;
      if (answer === '') return false;

      return true;
    },
    [answer, answers],
    []
  );

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    const answerNames = choices.filter(({ slug }) => answers.includes(slug)).map(nameMapper);
    const answerName = choices.find(({ slug }) => answer === slug)?.name;
    if (!answerName) return;

    handleSubmit(specification?.slug === 'choix-multiple' ? { answers: answerNames } : { answer: answerName });
  };

  return !choices || !specification || !question ? (
    <FormSkeleton full>
      <FormGroupSkeleton>
        <RadioInputSkeleton />

        <div className="flex ml-auto mt-auto">
          <ButtonSkeleton />
        </div>
      </FormGroupSkeleton>
    </FormSkeleton>
  ) : (
    <Form onSubmit={onSubmit} full>
      <FormGroup>
        {specification && specification.slug === 'choix-multiple' ? (
          <CheckboxInputGroup
            label="Réponses"
            values={answers}
            setValues={setAnswers}
            data={(question.typedQuestion.shuffle ? choices : sortById(choices)).map(nameSlugMapper)}
            key={uuidv4()}
          />
        ) : (
          <RadioInput
            label="Réponse"
            value={answer}
            setValue={setAnswer}
            values={(question.typedQuestion.shuffle ? choices : sortById(choices)).map(nameSlugMapper)}
            key={uuidv4()}
          />
        )}
      </FormGroup>

      <div className="flex ml-auto mt-auto">
        <Button type="success" disabled={!valid} submit>
          Valider
        </Button>
      </div>
    </Form>
  );
};

const Quiz = (): ReactElement => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [finished, setFinished] = useState(false);

  const { state: questionState, run: runQuestion } = useLoadStudentQuestion();
  const { state: eventState, run: runEvent } = useLoadStudentEvent({}, [runQuestion]);
  const { state: authState } = useAuthentication(ROLES.STUDENT.PERMISSION, [runEvent]);

  const { loading } = useLoading([authState, eventState, questionState]);

  const token = useAppSelector(selectToken);
  const quiz = useAppSelector(selectTempQuiz);
  const event = useAppSelector(selectTempEvent);
  const question = useAppSelector(selectTempQuestion) as IQuestion<TypedQuestion>;

  useEffect(() => {
    if (event && event.quiz) dispatch(setTempQuiz(event.quiz));
  }, [event]);

  const onBlur = () => {
    if (!event || !event.quiz || !event.quiz.strict) return;

    // TODO

    dispatch(addErrorNotification('Vous ne devez pas quitter la page sous peine de sanction.'));
  };

  useWindowFocus({ blurCb: onBlur });

  const getBadge = (): { type: BadgeType; content: string } | undefined => {
    if (question.remainingQuestions === undefined || question.answeredQuestions === undefined) return undefined;

    return { content: `${question.answeredQuestions + 1} / ${question.answeredQuestions + question.remainingQuestions}`, type: 'SUCCESS' };
  };

  const handleSubmit = async (payload: { answer: string } | { answers: Array<string> }): Promise<void> => {
    if (!quiz || !question || !token) return;

    const [created, error] = await answerQuestion(quiz.id, question.id, payload, token);

    if (error) {
      if (error.status === 403) router.push('/login');
      else dispatch(addErrorNotification(error.message));
    }

    if (!created) return;

    if (question.remainingQuestions === 1) setFinished(true);
    else runQuestion();
  };

  if (loading)
    return (
      <StudentDashboardSkeleton hideMenu>
        <ContainerSkeleton subtitle>
          <Bar />

          <FormSkeleton full>
            <FormGroupSkeleton>
              <InputSkeleton />
            </FormGroupSkeleton>

            <div className="flex mt-auto ml-auto">
              <ButtonSkeleton />
            </div>
          </FormSkeleton>
        </ContainerSkeleton>
      </StudentDashboardSkeleton>
    );

  if (!event)
    return (
      <StudentDashboard>
        <p className="m-auto">Aucun événement trouvé ...</p>
      </StudentDashboard>
    );

  if (event && finished)
    return (
      <StudentDashboard>
        <p className="m-auto">Fin du test...</p>
      </StudentDashboard>
    );

  return event && question ? (
    <StudentDashboard hideMenu>
      <Container title={question.title} subtitle={question.description} badge={getBadge()}>
        <Bar />

        {question.questionType === 'textualQuestion' && (
          <TextualQuestion question={question as IQuestion<ITextualQuestion>} handleSubmit={handleSubmit} />
        )}

        {question.questionType === 'numericQuestion' && (
          <NumericQuestion question={question as IQuestion<INumericQuestion>} handleSubmit={handleSubmit} />
        )}

        {question.questionType === 'choiceQuestion' && (
          <ChoiceQuestion question={question as IQuestion<IChoiceQuestion>} handleSubmit={handleSubmit} />
        )}
      </Container>
    </StudentDashboard>
  ) : (
    <StudentDashboard>
      <p className="m-auto">Ce test ne contient aucune question.</p>
    </StudentDashboard>
  );
};

export default Quiz;
