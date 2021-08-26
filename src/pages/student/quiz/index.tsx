import { useEffect, useState } from 'react';
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
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ButtonSkeleton from '@skeleton/ButtonSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import useLoadStudentQuestion from '@hooks/useLoadStudentQuestion';
import useLoadStudentEvent from '@hooks/useLoadStudentEvent';
import useAuthentication from '@hooks/useAuthentication';
import useWindowFocus from '@hooks/useWindowFocus';
import useAppDispatch from '@hooks/useAppDispatch';
import useAppSelector from '@hooks/useAppSelector';
import useValidation from '@hooks/useValidation';
import useLoading from '@hooks/useLoading';

import { nameSlugMapper, shuffle, sortById } from '@util/mapper.utils';

import { addErrorNotification } from '@redux/notificationSlice';
import { selectTempQuestion } from '@redux/questionSlice';
import { selectTempEvent } from '@redux/eventSlice';

import ROLES from '@constant/roles';

interface ITextualQuestionProps {
  question: IQuestion<ITextualQuestion>;
}

const TextualQuestion = ({ question }: ITextualQuestionProps): ReactElement => {
  const [answer, setAnswer] = useState('');

  const { valid } = useValidation(() => true, [answer], [answer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!valid) return;

    alert();
  };

  return (
    <Form onSubmit={handleSubmit} full>
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
}

const NumericQuestion = ({ question }: INumericQuestionProps): ReactElement => {
  const [answer, setAnswer] = useState('');
  const [dateAnswer, setDateAnswer] = useState(new Date());

  const { valid } = useValidation(() => true, [answer], [answer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!valid) return;

    alert();
  };

  const getInput = (): ReactElement => {
    const defaultInput = <NumberInput label="Réponse" value={answer} setValue={setAnswer} placeholder="00" type="nombre-entier" />;

    const specification = question.typedQuestion.questionSpecification;

    if (!specification) return defaultInput;

    if (['nombre-entier', 'nombre-decimal', 'pourcentage', 'prix'].includes(specification.slug))
      return <NumberInput label="Réponse" value={answer} setValue={setAnswer} placeholder="00" type={specification.slug} />;

    if (specification.slug === 'date') return <CalendarInput label="réponse" value={dateAnswer} setValue={setDateAnswer} />;

    return defaultInput;
  };

  return (
    <Form onSubmit={handleSubmit} full>
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
}

const ChoiceQuestion = ({ question }: IChoiceQuestionProps): ReactElement => {
  const [choices] = useState(question.typedQuestion.choices);
  const [specification] = useState(question.typedQuestion.questionSpecification);

  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState<Array<string>>([]);

  const { valid } = useValidation(() => true, [answer], [answer]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!valid) return;

    alert();
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
    <Form onSubmit={handleSubmit} full>
      <FormGroup>
        {specification && specification.slug === 'choix-multiple' ? (
          <CheckboxInputGroup
            label="Réponses"
            values={answers}
            setValues={setAnswers}
            data={(question.typedQuestion.shuffle ? shuffle(choices) : sortById(choices)).map(nameSlugMapper)}
            key={uuidv4()}
          />
        ) : (
          <RadioInput
            label="Réponse"
            value={answer}
            setValue={setAnswer}
            values={(question.typedQuestion.shuffle ? shuffle(choices) : sortById(choices)).map(nameSlugMapper)}
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
  const dispatch = useAppDispatch();

  const [finished, setFinished] = useState(false);

  const { state: questionState, run: runQuestion } = useLoadStudentQuestion();
  const { state: eventState, run: runEvent } = useLoadStudentEvent({ doNotRefetch: true }, [runQuestion]);
  const { state: authState } = useAuthentication(ROLES.STUDENT.PERMISSION, [runEvent]);

  const { loading } = useLoading([authState, eventState, questionState]);

  const event = useAppSelector(selectTempEvent);
  const question = useAppSelector(selectTempQuestion) as IQuestion<TypedQuestion>;

  const onBlur = () => {
    if (!event || !event.quiz || !event.quiz.strict) return;

    // TODO

    dispatch(addErrorNotification('Vous ne devez pas quitter la page sous peine de sanction.'));
  };

  useWindowFocus({ blurCb: onBlur });

  useEffect(() => {
    if (!question) return;

    if (question.remainingQuestions) setFinished(question.remainingQuestions === 0);
  }, [question]);

  const getBadge = (): { type: BadgeType; content: string } | undefined => {
    if (question.remainingQuestions === undefined || question.answeredQuestions === undefined) return undefined;

    return { content: `${question.answeredQuestions + 1} / ${question.answeredQuestions + question.remainingQuestions}`, type: 'SUCCESS' };
  };

  if (loading) return <StudentDashboardSkeleton></StudentDashboardSkeleton>;

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

        {question.questionType === 'textualQuestion' && <TextualQuestion question={question as IQuestion<ITextualQuestion>} />}
        {question.questionType === 'numericQuestion' && <NumericQuestion question={question as IQuestion<INumericQuestion>} />}
        {question.questionType === 'choiceQuestion' && <ChoiceQuestion question={question as IQuestion<IChoiceQuestion>} />}
      </Container>
    </StudentDashboard>
  ) : (
    <StudentDashboard>
      <p className="m-auto">Ce test ne contient aucune question.</p>
    </StudentDashboard>
  );
};

export default Quiz;
