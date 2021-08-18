import { Dispatch, FormEvent, ReactElement, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
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
import Textarea from '@element/Textarea';
import Dropdown from '@element/Dropdown';
import Input from '@element/Input';
import Title from '@element/Title';

import CheckboxInputSkeleton from '@skeleton/CheckboxInputSkeleton';
import FormButtonsSkeleton from '@skeleton/FormButtonsSkeleton';
import RadioInputSkeleton from '@skeleton/RadioInputSkeleton';
import FormGroupSkeleton from '@skeleton/FormGroupSkeleton';
import ContainerSkeleton from '@skeleton/ContainerSkeleton';
import InputSkeleton from '@skeleton/InputSkeleton';
import TitleSkeleton from '@skeleton/TitleSkeleton';
import FormSkeleton from '@skeleton/FormSkeleton';

import { isNull, nameMapper, nameSlugMapper, parseExactAnswer, parseNumericAnswer } from '@util/mapper.utils';
import { areArraysEquals, isOneLoading } from '@util/condition.utils';
import { getLength } from '@util/object.utils';

import { choiceSorter, generateChoices, removeChoices as removeStateChoices } from '@helpers/question.helper';

import {
  addChoices,
  addComparisonAnswer,
  addExactAnswers,
  clearAnswers,
  removeChoices,
  removeExactAnswers,
  updateChoiceQuestion,
  updateComparisonAnswer,
  updateNumericQuestion,
  updateTextualQuestion,
} from '@api/questions';

import { NotificationContext } from '@notificationContext/NotificationContext';

import { selectSpecifications, selectTempQuestion } from '@redux/questionSlice';
import { selectTempQuiz } from '@redux/quizSlice';
import useSwitch from '@hooks/useSwitch';
import { selectToken } from '@redux/authSlice';

import useLoadSpecifications from '@hooks/useLoadSpecifications';
import useAuthentication from '@hooks/useAuthentication';
import useLoadQuestion from '@hooks/useLoadQuestion';
import useAppSelector from '@hooks/useAppSelector';
import useLoadQuiz from '@hooks/useLoadQuiz';

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

interface IQuestionProps {
  quiz: IQuiz;
  question: Question;
  questionSpecifications: Array<IQuestionSpecification>;
  token: string;
}

interface ITextualQuestionProps extends IQuestionProps {
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
      if (title === '' || description === '') return false;

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

    if (getLength(updateAttributes) > 0) {
      const [updated, updateQuestionError] = await updateTextualQuestion(quiz.id, question.id, updateAttributes, token);

      if (updateQuestionError) {
        if (updateQuestionError.status === 403) router.push('/login');
        else addNotification({ content: updateQuestionError.message, type: 'ERROR' });
      }

      if (!updated) return;
    }

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

      <FormButtons href={`/professor/quizzes/${quiz.id}`} valid={valid} update />
    </Form>
  );
};

interface INumericQuestionProps extends IQuestionProps {
  question: IQuestion<INumericQuestion>;
}

const NumericQuestion = ({ quiz, question, questionSpecifications, token }: INumericQuestionProps): ReactElement => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const questionAnswers = question.answers as Array<IAnswer<IExactAnswer>>;
  const questionAnswer = question.answers[0] as IAnswer<IComparisonAnswer>;

  const firstAnswerType = questionAnswer.answerType === 'exactAnswer' ? 'exact' : 'comparison';

  // Constants

  const [specifications] = useState(questionSpecifications.map(nameSlugMapper));
  const [questionSpecification] = useState(question.typedQuestion.questionSpecification?.slug);

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
      if (title === '' || description === '') return false;

      if (specificationType === 'exact' && answers.length === 0) return false;
      if (specificationType === 'comparison' && (answerMin === '' || answerMax === '' || answerMin >= answerMax)) return false;

      if (
        title !== question.title ||
        description !== question.description ||
        specification !== questionSpecification ||
        specificationType !== firstAnswerType
      )
        return true;

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
  }, [title, description, answers, answerMin, answerMax, specification, specificationType]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    // Update the question instance
    const updateAttributes: AllOptional<NumericQuestionCreationAttributes> = {
      title: title !== question.title ? title : undefined,
      description: description !== question.description ? description : undefined,
      questionSpecificationSlug: specification !== questionSpecification ? specification : undefined,
    };

    if (getLength(updateAttributes) > 0) {
      const [updated, updateQuestionError] = await updateNumericQuestion(quiz.id, question.id, updateAttributes, token);

      if (updateQuestionError) {
        if (updateQuestionError.status === 403) router.push('/login');
        else addNotification({ content: updateQuestionError.message, type: 'ERROR' });
      }

      if (!updated) return;
    }

    // If the specification is different (integer / float / percentage ...) or the specification type is different (exact / comparison)
    // Means all the questions will change (reset then recreate).
    if (specification !== questionSpecification || specificationType !== firstAnswerType) {
      if (specificationType !== firstAnswerType) {
        await clearAnswers(quiz.id, question.id, token);
      }

      if (specificationType === 'exact') {
        const mappedAnswers: Array<ExactAnswerCreationAttributes> = answers.map((answer) => ({
          answerContent: parseExactAnswer(answer, specification),
        }));

        const [createdAnswers, answersCreationError] = await addExactAnswers(quiz.id, question.id, mappedAnswers, token);

        if (answersCreationError) {
          if (answersCreationError.status === 403) router.push('/login');
          else addNotification({ content: answersCreationError.message, type: 'ERROR' });
        }

        if (!createdAnswers) return;
      } else {
        const answer: ComparisonAnswerCreationAttributes = {
          greaterThan: parseNumericAnswer(answerMin, specification),
          lowerThan: parseNumericAnswer(answerMax, specification),
        };

        const [createdAnswer, answerCreationError] = await addComparisonAnswer(quiz.id, question.id, answer, token);

        if (answerCreationError) {
          if (answerCreationError.status === 403) router.push('/login');
          else addNotification({ content: answerCreationError.message, type: 'ERROR' });
        }

        if (!createdAnswer) return;
      }
    } else {
      // The specification and the specification type aren't modified, so the user only modifies the questions
      if (specificationType === 'comparison') {
        // If the question have an answer (questionAnswer === question.answers[0])
        // Means that whe update the comparison answer because only one comparison answer exists per answer
        if (questionAnswer) {
          const updateAttributes: AllOptional<ComparisonAnswerCreationAttributes> = {
            greaterThan: answerMin !== questionAnswerMin ? parseInt(answerMin) : undefined,
            lowerThan: answerMax !== questionAnswerMax ? parseInt(answerMax) : undefined,
          };

          if (getLength(updateAttributes) > 0) {
            const [updated, updateAnswerError] = await updateComparisonAnswer(quiz.id, question.id, questionAnswer.id, updateAttributes, token);

            if (updateAnswerError) {
              if (updateAnswerError.status === 403) router.push('/login');
              else addNotification({ content: updateAnswerError.message, type: 'ERROR' });
            }

            if (!updated) return;
          }
        } else {
          // Otherwise create the comparison answer
          const creationAttributes: ComparisonAnswerCreationAttributes = { greaterThan: parseInt(answerMin), lowerThan: parseInt(answerMax) };
          const [created, addAnswerError] = await addComparisonAnswer(quiz.id, question.id, creationAttributes, token);

          if (addAnswerError) {
            if (addAnswerError.status === 403) router.push('/login');
            else addNotification({ content: addAnswerError.message, type: 'ERROR' });
          }

          if (!created) return;
        }
      } else {
        // The specification type here is 'exact' so, we add and removed the answers
        const addedAnswers = answers.filter((answer) => !questionAnswersContent.includes(answer));
        const removedAnswers = questionAnswers.filter(({ typedAnswer }) => !answers.includes(typedAnswer.answerContent));

        if (addedAnswers.length > 0) {
          const addAnswersCreationAttributes: Array<ExactAnswerCreationAttributes> = addedAnswers.map((answer) => ({ answerContent: answer }));

          const [added, addAnswersError] = await addExactAnswers(quiz.id, question.id, addAnswersCreationAttributes, token);

          if (addAnswersError) {
            if (addAnswersError.status === 403) router.push('/login');
            else addNotification({ content: addAnswersError.message, type: 'ERROR' });
          }

          if (!added) return;
        }

        if (removedAnswers.length > 0) {
          const removeAnswersCreationAttributes: Array<number> = removedAnswers.map(({ id }) => id);

          const [removed, removeAnswersError] = await removeExactAnswers(quiz.id, question.id, removeAnswersCreationAttributes, token);

          if (removeAnswersError) {
            if (removeAnswersError.status === 403) router.push('/login');
            else addNotification({ content: removeAnswersError.message, type: 'ERROR' });
          }

          if (!removed) return;
        }
      }
    }

    addNotification({ content: 'Question modifiée.', type: 'INFO' });
    router.push(`/professor/quizzes/${quiz.id}`);
  };

  return (
    <Form full={true} onSubmit={handleSubmit}>
      <Row wrap>
        <QuestionDefaultFields {...{ title, setTitle, description, setDescription }} />

        <FormGroup>
          <Title level={2}>Options du type</Title>

          <Dropdown label="Spécification" placeholder="test" values={specifications} value={specification} setValue={setSpecification} />

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
              />

              {specificationType === 'comparison' ? (
                <Row className="w-80">
                  <NumberInput label="Minimum" type={specification} value={answerMin} setValue={setAnswerMin} error={answerMax < answerMin} />
                  <NumberInput label="Maximum" type={specification} value={answerMax} setValue={setAnswerMax} error={answerMin > answerMax} />
                </Row>
              ) : (
                <MultipleNumberInput label="Réponses" type={specification} values={answers} setValues={setAnswers} />
              )}
            </>
          )}

          {['date'].includes(specification) && <MultipleNumberInput label="Réponses" type={specification} values={answers} setValues={setAnswers} />}
        </FormGroup>
      </Row>

      <FormButtons href={`/professor/quizzes/${quiz.id}`} valid={valid} update />
    </Form>
  );
};

interface IChoiceQuestionProps extends IQuestionProps {
  question: IQuestion<IChoiceQuestion>;
}

const ChoiceQuestion = ({ quiz, question, questionSpecifications, token }: IChoiceQuestionProps): ReactElement => {
  const router = useRouter();

  const { addNotification } = useContext(NotificationContext);

  const choiceMapper = (choices: Array<IChoice>): Array<EditableInputValue> => {
    return choices.map((choice, index) => ({ id: index, name: choice.name, checked: choice.valid, defaultName: choice.name }));
  };

  const [questionChoices] = useState(choiceMapper(question.typedQuestion.choices));
  const [specifications] = useState(questionSpecifications.map(nameSlugMapper));
  const [questionSpecification] = useState(question.typedQuestion.questionSpecification?.slug);

  const [valid, setValid] = useState(false);

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [shuffle, setShuffle] = useState(question.typedQuestion.shuffle);

  const [specification, setSpecification] = useState(questionSpecification || 'choix-unique');

  const [choiceAmount, setChoiceAmount] = useState(question.typedQuestion.choices.length.toString());

  const [uniqueChoices, setUniqueChoices] = useState(questionChoices);
  const [multipleChoices, setMultipleChoices] = useState(questionChoices);

  useEffect(() => {
    const isValid = (): boolean => {
      const choices = specification === 'choix-unique' ? uniqueChoices : multipleChoices;

      const questionChoicesName = question.typedQuestion.choices.map(({ name }) => name);
      const choicesName = choices.map(({ name }) => name);

      const questionCheckedChoices = question.typedQuestion.choices.filter(({ valid }) => valid).map(nameMapper);
      const checkedChoices = choices.filter(({ checked }) => checked).map(nameMapper);

      if (title === '' || description === '') return false;

      if (specification === 'choix-unique' ? uniqueChoices === [] : multipleChoices === []) return false;

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
  }, [title, description, shuffle, specification, uniqueChoices, multipleChoices]);

  useEffect(() => {
    const choicesLength = specification === 'choix-unique' ? uniqueChoices.length : multipleChoices.length;
    const setterFunction = specification === 'choix-unique' ? setUniqueChoices : setMultipleChoices;

    if (parseInt(choiceAmount) > choicesLength) {
      setterFunction((prev) => generateChoices(parseInt(choiceAmount) - choicesLength, prev));
    }

    if (parseInt(choiceAmount) < choicesLength) {
      setterFunction((prev) => removeStateChoices(-(choicesLength - parseInt(choiceAmount)), prev));
    }
  }, [choiceAmount]);

  useEffect(() => {
    if (specification === 'choix-unique') setChoiceAmount(uniqueChoices.length.toString());
    else setChoiceAmount(multipleChoices.length.toString());
  }, [specification]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!valid) return;

    // Update the question instance
    const updateAttributes: AllOptional<ChoiceQuestionCreationAttributes> = {
      title: title !== question.title ? title : undefined,
      description: description !== question.description ? description : undefined,
      shuffle: shuffle !== question.typedQuestion.shuffle ? shuffle : undefined,
      questionSpecificationSlug: specification !== questionSpecification ? specification : undefined,
    };

    if (getLength(updateAttributes) > 0) {
      const [updated, updateQuestionError] = await updateChoiceQuestion(quiz.id, question.id, updateAttributes, token);

      if (updateQuestionError) {
        if (updateQuestionError.status === 403) router.push('/login');
        else addNotification({ content: updateQuestionError.message, type: 'ERROR' });
      }

      if (!updated) return;
    }

    // Update the choices
    if (
      specification !== questionSpecification ||
      (specification === 'choix-unique' && uniqueChoices !== questionChoices) ||
      (specification !== 'choice-unique' && multipleChoices !== questionChoices)
    ) {
      const choices = specification === 'choix-unique' ? uniqueChoices : multipleChoices;

      if (specification === questionSpecification) {
        const newChoices = choices.filter(({ name, checked }) => {
          return !questionChoices.some(({ name: _name, checked: _checked }) => name === _name && checked === _checked);
        });

        const removedChoices = questionChoices.filter(({ name, checked }) => {
          return !choices.some(({ name: _name, checked: _checked }) => name === _name && checked === _checked);
        });

        if (removedChoices.length > 0) {
          const choicesId = question.typedQuestion.choices
            .filter(({ name }) => removedChoices.some(({ name: _name }) => name === _name))
            .map(({ id }) => id);

          const [removed, removeChoicesError] = await removeChoices(quiz.id, question.id, choicesId, token);

          if (removeChoicesError) {
            if (removeChoicesError.status === 403) router.push('/login');
            else addNotification({ content: removeChoicesError.message, type: 'ERROR' });
          }

          if (!removed) return;
        }

        if (newChoices.length > 0) {
          const [added, addChoicesError] = await addChoices(quiz.id, question.id, newChoices, token);

          if (addChoicesError) {
            if (addChoicesError.status === 403) router.push('/login');
            else addNotification({ content: addChoicesError.message, type: 'ERROR' });
          }

          if (!added) return;
        }
      } else {
        const [added, addChoicesError] = await addChoices(quiz.id, question.id, choices, token);

        if (addChoicesError) {
          if (addChoicesError.status === 403) router.push('/login');
          else addNotification({ content: addChoicesError.message, type: 'ERROR' });
        }

        if (!added) return;
      }
    }

    addNotification({ content: 'Question modifiée.', type: 'INFO' });
    router.push(`/professor/quizzes/${quiz.id}`);
  };

  return (
    <Form full={true} onSubmit={handleSubmit}>
      <Row wrap>
        <QuestionDefaultFields {...{ title, setTitle, description, setDescription }} />

        <FormGroup>
          <Title level={2}>Options du type</Title>

          <Dropdown label="Spécification" placeholder="test" values={specifications} value={specification} setValue={setSpecification} />

          <CheckboxInput label="Option supplémentaire" values={[{ name: 'Mélanger les choix', checked: shuffle, setValue: setShuffle }]} />

          <NumberInput label="Nombre de réponses" type="nombre-entier" value={choiceAmount} setValue={setChoiceAmount} min={2} />

          {specification === 'choix-unique' ? (
            <EditableRadioInput label="Choix" placeholder="Choix" values={uniqueChoices} setValues={setUniqueChoices} maxLength={35} />
          ) : (
            <EditableCheckboxInput label="Choix" placeholder="Choix" values={multipleChoices} setValues={setMultipleChoices} maxLength={35} />
          )}
        </FormGroup>
      </Row>

      <FormButtons href={`/professor/quizzes/${quiz.id}`} valid={valid} update />
    </Form>
  );
};

const TypedQuestionSkeleton = (): ReactElement => {
  return (
    <FormSkeleton full>
      <Row wrap>
        <FormGroupSkeleton>
          <TitleSkeleton level={2} />

          <InputSkeleton maxLength />
          <InputSkeleton textArea maxLength />
          <InputSkeleton />
        </FormGroupSkeleton>

        <FormGroupSkeleton>
          <TitleSkeleton level={2} />

          <RadioInputSkeleton amount={3} />
          <CheckboxInputSkeleton />
        </FormGroupSkeleton>
      </Row>

      <FormButtonsSkeleton />
    </FormSkeleton>
  );
};

const hooksConfig = {
  notFoundRedirect: '/professor/quizes',
};

const Question = (): ReactElement => {
  const value = useSwitch('p');

  const router = useRouter();

  const { quizId, questionId } = router.query;

  const { state: specificationState, run: runSpecification } = useLoadSpecifications();
  const { state: quizState, run: runQuiz } = useLoadQuiz(parseInt(quizId as string), hooksConfig);
  const { state: questionState, run: runQuestion } = useLoadQuestion(parseInt(quizId as string), parseInt(questionId as string), hooksConfig);
  const { state: authState } = useAuthentication(ROLES.PROFESSOR.PERMISSION, [runQuiz, runQuestion, runSpecification]);

  const token = useAppSelector(selectToken);
  const question = useAppSelector(selectTempQuestion);
  const quiz = useAppSelector(selectTempQuiz);
  const specifications = useAppSelector(selectSpecifications);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isOneLoading([quizState, questionState, authState, specificationState]) || isNull(question) || isNull(quiz));
  }, [quizState, questionState, authState, specificationState]);

  const getComponent = (): ReactElement => {
    if (!question || !quiz || !token) return <></>;

    const textualQuestion = question as IQuestion<ITextualQuestion>;
    const numericQuestion = question as IQuestion<INumericQuestion>;
    const choiceQuestion = question as IQuestion<IChoiceQuestion>;

    const props = { quiz, questionSpecifications: specifications, token };

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

  return loading || value ? (
    <ProfessorDashboardSkeleton>
      <ContainerSkeleton breadcrumb>
        <hr className="mt-8 mb-8" />

        <TypedQuestionSkeleton />
      </ContainerSkeleton>
    </ProfessorDashboardSkeleton>
  ) : (
    <ProfessorDashboard>
      <Container
        title="Modifier une question"
        breadcrumb={[
          { name: 'Tests', path: '/professor/quizzes' },
          { name: quiz?.title || 'Quiz', path: `/professor/quizzes/${quiz?.id || ''}` },
          { name: 'Modifier une question' },
        ]}
      >
        <hr className="mt-8 mb-8" />

        {getComponent()}
      </Container>
    </ProfessorDashboard>
  );
};

export default Question;
