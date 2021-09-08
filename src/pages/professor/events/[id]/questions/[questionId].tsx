import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import { FormEvent, ReactElement, useState } from 'react';

import React from 'react';
import clsx from 'clsx';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import Container from '@module/Container';
import Form from '@module/Form';

import LinkButton from '@element/LinkButton';
import Subtitle from '@element/Subtitle';
import Button from '@element/Button';
import Title from '@element/Title';
import Bar from '@element/Bar';

import useLoadQuestionToCorrect from '@hooks/useLoadQuestionToCorrect';
import useAuthentication from '@hooks/useAuthentication';
import useAppSelector from '@hooks/useAppSelector';
import useLoading from '@hooks/useLoading';

import { selectTempQuestion } from '@redux/questionSlice';

import ROLES from '@constant/roles';
import { updateUserAnswerValidity } from '@api/questions';
import { selectToken } from '@redux/authSlice';
import useAppDispatch from '@hooks/useAppDispatch';
import { addSuccessNotification } from '@redux/notificationSlice';

const EventQuestion = (): ReactElement => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { id: eventId, questionId } = router.query;

  const { state: questionState, run: runQuestion } = useLoadQuestionToCorrect(parseInt(eventId as string), parseInt(questionId as string), {
    notFoundRedirect: `/professeur/events/${eventId}`,
  });

  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runQuestion]);

  const { loading } = useLoading([questionState, authState]);

  const question = useAppSelector(selectTempQuestion);
  const token = useAppSelector(selectToken);

  const [rejectedAnswers, setRejectedAnswers] = useState<Array<number>>([]);

  const switchRejectedAnswer = (id: number): void => {
    setRejectedAnswers((prev) => {
      const newPrev = [...prev];

      if (prev.includes(id)) delete newPrev[newPrev.indexOf(id)];
      else newPrev.push(id);

      return newPrev;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!question || !token || !question.userAnswers) return;

    for (const userAnswer of question.userAnswers) {
      await updateUserAnswerValidity(parseInt(eventId as string), question.id, userAnswer.id, !rejectedAnswers.includes(userAnswer.id), token);
    }

    dispatch(addSuccessNotification('Validitées modifiées'));
    router.push(`/professor/events/${eventId}`);
  };

  return loading || !question ? (
    <ProfessorDashboardSkeleton></ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container
        title="Correction de question"
        breadcrumb={[
          { name: 'Événements', path: '/professor/events' },
          { name: 'Événement', path: `/professeur/events/${eventId}` },
          { name: 'Corriger une question' },
        ]}
      >
        <Bar />

        <Title level={2}>{question.title}</Title>
        <Subtitle>{question.description}</Subtitle>

        <Form onSubmit={handleSubmit} full>
          <div className="flex flex-col gap-12 mt-8 text-gray-600">
            {question.userAnswers.map((userAnswer) => (
              <p
                key={uuidv4()}
                className={clsx([
                  'text-justify border-l-2 border-gray-900 pl-4 py-2 cursor-pointer',
                  'hover:border-blue-600 transition-all duration-300',
                  rejectedAnswers.includes(userAnswer.id) && 'line-through',
                ])}
                onClick={() => switchRejectedAnswer(userAnswer.id)}
              >
                {userAnswer.answerContent}
              </p>
            ))}
          </div>

          <div className="flex mt-auto ml-auto">
            <LinkButton href={`/professeur/event/${eventId}`} primary={false} className="mr-6">
              Annuler
            </LinkButton>

            <Button className="flex-shrink" submit>
              Valider
            </Button>
          </div>
        </Form>
      </Container>
    </ProfessorDashboard>
  );
};

export default EventQuestion;
