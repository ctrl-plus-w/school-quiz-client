import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import type { FormEvent, ReactElement } from 'react';

import React from 'react';

import StudentDashboardSkeleton from '@layout/StudentDashboardSkeleton';
import StudentDashboard from '@layout/StudentDashboard';

import FormGroup from '@module/FormGroup';
import Container from '@module/Container';
import Row from '@module/Row';

import CheckboxInputGroup from '@element/CheckboxInputGroup';
import CalendarInput from '@element/CalendarInput';
import NumberInput from '@element/NumberInput';
import RadioInput from '@element/RadioInput';
import Textarea from '@element/Textarea';
import Button from '@element/Button';
import Title from '@element/Title';
import Input from '@element/Input';
import Form from '@module/Form';
import Bar from '@element/Bar';

import RadioInputSkeleton from '@skeleton/RadioInputSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ButtonSkeleton from '@skeleton/ButtonSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';
import Countdown from '@element/Countdown';

import useLoadStudentQuestion from '@hooks/useLoadStudentQuestion';
import useLoadStudentEvent from '@hooks/useLoadStudentEvent';
import useAuthentication from '@hooks/useAuthentication';
import useWindowFocus from '@hooks/useWindowFocus';
import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import useValidation from '@hooks/useValidation';
import useLoading from '@hooks/useLoading';
import useSocket from '@hooks/useSocket';

import { nameMapper, nameSlugMapper, shuffle, sortById } from '@util/mapper.utils';
import { incrementSeconds } from '@util/date.utils';

import { answerQuestion } from '@api/questions';

import { addErrorNotification } from '@redux/notificationSlice';
import { selectTempQuiz, setTempQuiz } from '@redux/quizSlice';
import { selectTempQuestion } from '@redux/questionSlice';
import { selectTempEvent } from '@redux/eventSlice';
import { selectToken } from '@redux/authSlice';

import ROLES from '@constant/roles';

interface IFormLayoutProps {
  children: ReactElement;
  valid: boolean;
  strict: boolean;

  onSubmit: (e: FormEvent) => void;
}

const FormLayout = ({ children, onSubmit, valid, strict }: IFormLayoutProps) => {
  return (
    <Form onSubmit={onSubmit} full>
      <Row className="w-full ">
        <FormGroup>{children}</FormGroup>

        {strict && (
          <div className="ml-auto mb-auto p-5 bg-red-200 border border-red-300 rounded">
            <p className="text-sm text-red-600 w-96">
              Le test est en mode strict, vous ne pouvez donc pas quitter la page, si vous quitter la page plus de 3 fois, vous ne pourrez plus
              participer au test.
            </p>
          </div>
        )}
      </Row>

      <div className="flex ml-auto mt-auto">
        <Button type="success" disabled={!valid} submit>
          Valider
        </Button>
      </div>
    </Form>
  );
};

interface ITextualQuestionProps {
  question: IQuestion<ITextualQuestion>;
  handleSubmit: (answerOrAnswers: { answer: string } | { answers: Array<string> }) => Promise<void>;

  strict: boolean;
  long: boolean;
}

const TextualQuestion = ({ handleSubmit, long, strict }: ITextualQuestionProps): ReactElement => {
  const [answer, setAnswer] = useState('');

  const { valid } = useValidation(() => true, [answer], [answer]);

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    handleSubmit({ answer });
  };

  return (
    <FormLayout onSubmit={onSubmit} valid={valid} strict={strict}>
      {long ? (
        <Textarea label="Réponse" value={answer} setValue={setAnswer} placeholder="Hello World" className="w-96" maxLength={750} />
      ) : (
        <Input label="Réponse" value={answer} setValue={setAnswer} placeholder="Hello World" />
      )}
    </FormLayout>
  );
};

interface INumericQuestionProps {
  question: IQuestion<INumericQuestion>;
  handleSubmit: (answerOrAnswers: { answer: string } | { answers: Array<string> }) => Promise<void>;

  strict: boolean;
}

const NumericQuestion = ({ question, handleSubmit, strict }: INumericQuestionProps): ReactElement => {
  const [specification] = useState(question.typedQuestion.questionSpecification);

  const [answer, setAnswer] = useState('');
  const [dateAnswer, setDateAnswer] = useState(new Date());

  const { valid } = useValidation(
    () => {
      if (specification && specification.slug !== 'date') return answer !== '';
      return true;
    },
    [answer],
    []
  );

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    handleSubmit(specification?.slug === 'date' ? { answer: dateAnswer.toISOString() } : { answer });
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
    <FormLayout onSubmit={onSubmit} valid={valid} strict={strict}>
      {getInput()}
    </FormLayout>
  );
};

interface IChoiceQuestionProps {
  question: IQuestion<IChoiceQuestion>;
  handleSubmit: (answerOrAnswers: { answer: string } | { answers: Array<string> }) => Promise<void>;

  strict: boolean;
}

const ChoiceQuestion = ({ question, handleSubmit, strict }: IChoiceQuestionProps): ReactElement => {
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
    <FormLayout onSubmit={onSubmit} valid={valid} strict={strict}>
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
    </FormLayout>
  );
};

const Quiz = (): ReactElement => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [blocked, setBlocked] = useState(false);
  const [lastWarn, setLastWarn] = useState(new Date(1000, 0, 0, 0));
  const [verificationType, setVerificationType] = useState<IVerificationType | undefined>(undefined);
  const [finished, setFinished] = useState(false);

  const { state: questionState, run: runQuestion } = useLoadStudentQuestion();
  const { state: eventState, run: runEvent } = useLoadStudentEvent({}, [runQuestion]);
  const { state: authState } = useAuthentication(ROLES.STUDENT.PERMISSION, [runEvent]);

  const { loading } = useLoading([authState, eventState, questionState]);

  const token = useAppSelector(selectToken);
  const quiz = useAppSelector(selectTempQuiz);
  const event = useAppSelector(selectTempEvent);
  const question = useAppSelector(selectTempQuestion) as IQuestion<TypedQuestion>;

  const socket = useSocket(token);

  useEffect(() => {
    if (!event) return;

    if (event.quiz) dispatch(setTempQuiz(event.quiz));
    if (event.remainingQuestions === 0) setFinished(true);
  }, [event]);

  useEffect(() => {
    if (!question || !question.typedQuestion) return;

    if (question.blocked) setBlocked(true);

    if (question.questionType === 'textualQuestion') {
      const textualQuestion = question.typedQuestion as ITextualQuestion;
      setVerificationType(textualQuestion.verificationType);
    }
  }, [question]);

  const onBlur = async () => {
    if (!event || !event.quiz || !event.quiz.strict || !token || !socket || finished || blocked) return;

    // If the quiz is inFuture, do not send warn
    if (event.inFuture) return;

    // Prevent from having too much warns in a short time (3 secs interval)
    if (incrementSeconds(lastWarn, 3).valueOf() > Date.now()) return;

    setLastWarn(new Date());

    socket.emit('user:warn');

    dispatch(addErrorNotification('Vous ne devez pas quitter la page sous peine de sanction.'));
  };

  useWindowFocus({ blurCb: onBlur });

  const getBadge = (): { type: BadgeType; content: string } | undefined => {
    if (question.remainingQuestions === undefined || question.answeredQuestions === undefined) return undefined;

    return { content: `${question.answeredQuestions + 1} / ${question.answeredQuestions + question.remainingQuestions}`, type: 'SUCCESS' };
  };

  const handleSubmit = async (payload: { answer: string } | { answers: Array<string> }): Promise<void> => {
    if (!quiz || !question || !token || !event || blocked) return;

    const [created, error] = await answerQuestion(quiz.id, question.id, payload, token);

    if (error) {
      if (error.status === 403) router.push('/login');
      else dispatch(addErrorNotification(error.message));
    }

    if (!created) return;

    runEvent();
  };

  useEffect(() => {
    if (!socket || !event) return;

    socket.emit('user:join');

    socket.on('quiz:blocked', () => {
      setBlocked(true);
    });

    socket.on('event:start', () => {
      runEvent();
    });
  }, [socket, event]);

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

  if (!event || !quiz)
    return (
      <StudentDashboard>
        <div className="flex flex-col items-center m-auto">
          <Title>Aucun test disponible !</Title>
          <p className="mt-4">Vous n&apos;avez aucun tests auquels vous pouvez participer.</p>
        </div>
      </StudentDashboard>
    );

  if (event && finished)
    return (
      <StudentDashboard>
        <div className="flex flex-col items-center m-auto">
          <Title>Terminé !</Title>
          <p className="mt-4">Vous avez terminé le test.</p>
        </div>
      </StudentDashboard>
    );

  if (event && event.inFuture)
    return (
      <StudentDashboard>
        <div className="flex flex-col m-auto text-4xl">
          <Countdown until={incrementSeconds(new Date(event.start), 10)} cb={runEvent} />
        </div>
      </StudentDashboard>
    );

  return event && question ? (
    <>
      {blocked && (
        <div className="z-50 fixed top-0 left-0 flex items-center justify-center w-full h-full bg-black bg-opacity-75">
          <div className="flex flex-col gap-6 items-start bg-white w-96 p-12 rounded">
            <Title>Attention !</Title>

            <p className="text-gray-700">
              Vous avez quitté trop de fois la page, vous ne pouvez donc plus participer au test jusqu&apos;à ce qu&apos;un professeur vous y
              autorise.
            </p>
          </div>
        </div>
      )}

      <StudentDashboard hideMenu>
        <Container title={question.title} subtitle={question.description} badge={getBadge()}>
          <Bar />

          {question.questionType === 'textualQuestion' && (
            <TextualQuestion
              question={question as IQuestion<ITextualQuestion>}
              handleSubmit={handleSubmit}
              long={verificationType?.slug === 'manuel'}
              strict={quiz.strict}
            />
          )}

          {question.questionType === 'numericQuestion' && (
            <NumericQuestion question={question as IQuestion<INumericQuestion>} handleSubmit={handleSubmit} strict={quiz.strict} />
          )}

          {question.questionType === 'choiceQuestion' && (
            <ChoiceQuestion question={question as IQuestion<IChoiceQuestion>} handleSubmit={handleSubmit} strict={quiz.strict} />
          )}
        </Container>
      </StudentDashboard>
    </>
  ) : (
    <StudentDashboard>
      <p className="m-auto">Ce test ne contient aucune question.</p>
    </StudentDashboard>
  );
};

export default Quiz;
