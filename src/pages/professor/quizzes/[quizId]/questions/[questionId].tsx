import { Dispatch, FormEvent, ReactElement, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/dist/client/router';

import React from 'react';

import ProfessorDashboardSkeleton from '@layout/ProfessorDashboardSkeleton';
import ProfessorDashboard from '@layout/ProfessorDashboard';

import FormButtons from '@module/FormButtons';
import Container from '@module/Container';
import FormGroup from '@module/FormGroup';
import Form from '@module/Form';
import Row from '@module/Row';

import MultipleCalendarInput from '@element/MultipleCalendarInput';
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

import { nameMapper, nameSlugMapper, parseNumericAnswer, questionTypeFilter, str } from '@util/mapper.utils';
import { hasDuplicatedElements } from '@util/array.utils';
import { areArraysEquals } from '@util/condition.utils';
import { getLength } from '@util/object.utils';
import { isSameDate } from '@util/date.utils';

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

import useAppDispatch from '@hooks/useAppDispatch';

import { addErrorNotification, addSuccessNotification } from '@redux/notificationSlice';

import { selectSpecifications, selectTempQuestion } from '@redux/questionSlice';
import { selectTempQuiz } from '@redux/quizSlice';
import { selectToken } from '@redux/authSlice';

import useLoadSpecifications from '@hooks/useLoadSpecifications';
import useAuthentication from '@hooks/useAuthentication';
import useLoadQuestion from '@hooks/useLoadQuestion';
import useAppSelector from '@hooks/useAppSelector';
import useValidation from '@hooks/useValidation';
import useLoadQuiz from '@hooks/useLoadQuiz';
import useLoading from '@hooks/useLoading';

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

  const dispatch = useAppDispatch();

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [caseSensitive, setCaseSensitive] = useState(question.typedQuestion.caseSensitive);
  const [accentSensitive, setAccentSensitive] = useState(question.typedQuestion.accentSensitive);

  const questionVerificationType = question.typedQuestion.verificationType?.slug as VerificationType | undefined;
  const [verificationType, setVerificationType] = useState<VerificationType>(questionVerificationType || 'manuel');

  const questionAnswers = question.answers as Array<IAnswer<IExactAnswer>>;
  const questionAnswersContent = questionAnswers.map(({ typedAnswer }) => typedAnswer.answerContent);

  const [answers, setAnswers] = useState(questionAnswersContent);

  const { valid } = useValidation(
    () => {
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
    },
    [title, description, verificationType, caseSensitive, accentSensitive, answers],
    [title, description]
  );

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
        else dispatch(addErrorNotification(updateQuestionError.message));
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
          else dispatch(addErrorNotification(addedAnswersError.message));
        }

        if (!added) return;
      }

      if (removedAnswers.length > 0) {
        const removeAnswersCreationAttributes: Array<number> = removedAnswers.map(({ id }) => id);
        const [removed, removedAnswersError] = await removeExactAnswers(quiz.id, question.id, removeAnswersCreationAttributes, token);

        if (removedAnswersError) {
          if (removedAnswersError.status === 403) router.push('/login');
          else dispatch(addErrorNotification(removedAnswersError.message));
        }

        if (!removed) return;
      }
    }

    dispatch(addSuccessNotification('Question modifiée.'));
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

  const dispatch = useAppDispatch();

  const questionAnswers = question.answers as Array<IAnswer<IExactAnswer>>;
  const questionAnswer = question.answers[0] as IAnswer<IComparisonAnswer>;

  const firstAnswerType = questionAnswer.answerType === 'exactAnswer' ? 'exact' : 'comparison';

  // Constants

  const [specifications, setSpecifications] = useState<Array<IBasicModel>>([]);
  const [questionSpecification] = useState(question.typedQuestion.questionSpecification?.slug);

  const [questionAnswersContent] = useState(questionAnswers.map(({ typedAnswer }) => typedAnswer.answerContent));

  // States

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [specification, setSpecification] = useState(questionSpecification || 'nombre-entier');

  const [specificationType, setSpecificationType] = useState<'exact' | 'comparison'>(questionAnswer ? firstAnswerType : 'exact');

  const [answers, setAnswers] = useState(specification !== 'date' ? questionAnswersContent : []);
  const [dateAnswers, setDateAnswers] = useState(specification === 'date' ? questionAnswersContent.map((answer) => new Date(answer)) : []);

  const [questionAnswerMin] = useState(specificationType === 'comparison' ? questionAnswer?.typedAnswer?.greaterThan?.toString() : '');
  const [questionAnswerMax] = useState(specificationType === 'comparison' ? questionAnswer?.typedAnswer?.lowerThan?.toString() : '');

  const [answerMin, setAnswerMin] = useState(questionAnswerMin);
  const [answerMax, setAnswerMax] = useState(questionAnswerMax);

  const { valid } = useValidation(
    () => {
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
        if (specification === 'date' && areArraysEquals(questionAnswersContent, dateAnswers.map(str))) return false;
        if (specification !== 'date' && areArraysEquals(questionAnswersContent, answers)) return false;
      }

      if (specificationType === 'comparison') {
        if (questionAnswerMin === answerMin && questionAnswerMax === answerMax) return false;
      }

      return true;
    },
    [title, description, answers, dateAnswers, answerMin, answerMax, specification, specificationType],
    [title, description]
  );

  useEffect(() => {
    specification === 'date' && setAnswers(dateAnswers.map((date) => date.toString()));
  }, [dateAnswers]);

  useEffect(() => {
    if (!questionSpecifications) return;

    setSpecifications(() => questionSpecifications.filter(questionTypeFilter('numericQuestion')).map(nameSlugMapper));
  }, [questionSpecifications]);

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
        else dispatch(addErrorNotification(updateQuestionError.message));
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
        const mappedAnswers: Array<ExactAnswerCreationAttributes> =
          specification === 'date'
            ? dateAnswers.map((answer) => ({ answerContent: answer.toISOString() }))
            : answers.map((answer) => ({ answerContent: answer }));

        const [createdAnswers, answersCreationError] = await addExactAnswers(quiz.id, question.id, mappedAnswers, token);

        if (answersCreationError) {
          if (answersCreationError.status === 403) router.push('/login');
          else dispatch(addErrorNotification(answersCreationError.message));
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
          else dispatch(addErrorNotification(answerCreationError.message));
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
              else dispatch(addErrorNotification(updateAnswerError.message));
            }

            if (!updated) return;
          }
        } else {
          // Otherwise create the comparison answer
          const creationAttributes: ComparisonAnswerCreationAttributes = { greaterThan: parseInt(answerMin), lowerThan: parseInt(answerMax) };
          const [created, addAnswerError] = await addComparisonAnswer(quiz.id, question.id, creationAttributes, token);

          if (addAnswerError) {
            if (addAnswerError.status === 403) router.push('/login');
            else dispatch(addErrorNotification(addAnswerError.message));
          }

          if (!created) return;
        }
      } else {
        // The specification type here is 'exact' so, we add and removed the answers
        const addedAnswers =
          specification === 'date'
            ? dateAnswers.filter((answer) => !questionAnswersContent.some((_answer) => isSameDate(answer, new Date(_answer)))).map(str)
            : answers.filter((answer) => !questionAnswersContent.includes(answer));

        const removedAnswers =
          specification === 'date'
            ? questionAnswers.filter(({ typedAnswer }) => !dateAnswers.some((_answer) => isSameDate(new Date(typedAnswer.answerContent), _answer)))
            : questionAnswers.filter(({ typedAnswer }) => !answers.includes(typedAnswer.answerContent));

        if (addedAnswers.length > 0) {
          const addAnswersCreationAttributes: Array<ExactAnswerCreationAttributes> = addedAnswers.map((answer) => ({ answerContent: answer }));

          const [added, addAnswersError] = await addExactAnswers(quiz.id, question.id, addAnswersCreationAttributes, token);

          if (addAnswersError) {
            if (addAnswersError.status === 403) router.push('/login');
            else dispatch(addErrorNotification(addAnswersError.message));
          }

          if (!added) return;
        }

        if (removedAnswers.length > 0) {
          const removeAnswersCreationAttributes: Array<number> = removedAnswers.map(({ id }) => id);

          const [removed, removeAnswersError] = await removeExactAnswers(quiz.id, question.id, removeAnswersCreationAttributes, token);

          if (removeAnswersError) {
            if (removeAnswersError.status === 403) router.push('/login');
            else dispatch(addErrorNotification(removeAnswersError.message));
          }

          if (!removed) return;
        }
      }
    }

    dispatch(addSuccessNotification('Question modifiée.'));
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

          {['date'].includes(specification) && (
            <MultipleCalendarInput label="Réponses" values={dateAnswers} setValues={setDateAnswers} currentClickable />
          )}
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

  const dispatch = useAppDispatch();

  const choiceMapper = (choices: Array<IChoice>): Array<EditableInputValue> => {
    return choices.map((choice, index) => ({ id: index, name: choice.name, checked: choice.valid, defaultName: choice.name }));
  };

  const [specifications, setSpecifications] = useState<Array<IBasicModel>>([]);
  const [questionChoices] = useState(choiceMapper(question.typedQuestion.choices));
  const [questionSpecification] = useState(question.typedQuestion.questionSpecification?.slug);

  const [title, setTitle] = useState(question.title);
  const [description, setDescription] = useState(question.description);

  const [shuffle, setShuffle] = useState(question.typedQuestion.shuffle);

  const [specification, setSpecification] = useState(questionSpecification || 'choix-unique');

  const [choiceAmount, setChoiceAmount] = useState(question.typedQuestion.choices.length.toString());

  const [uniqueChoices, setUniqueChoices] = useState(questionChoices);
  const [multipleChoices, setMultipleChoices] = useState(questionChoices);

  const { valid } = useValidation(
    () => {
      const choices = specification === 'choix-unique' ? uniqueChoices : multipleChoices;

      const questionChoicesName = question.typedQuestion.choices.map(({ name }) => name);
      const choicesName = choices.map(({ name }) => name);

      const questionCheckedChoices = question.typedQuestion.choices.filter(({ valid }) => valid).map(nameMapper);
      const checkedChoices = choices.filter(({ checked }) => checked).map(nameMapper);

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

      if (hasDuplicatedElements(choices.map(nameMapper))) return false;

      return true;
    },
    [title, description, shuffle, specification, uniqueChoices, multipleChoices],
    [title, description]
  );

  useEffect(() => {
    if (!questionSpecifications) return;

    setSpecifications(() => questionSpecifications.filter(questionTypeFilter('choiceQuestion')).map(nameSlugMapper));
  }, [questionSpecifications]);

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
        else dispatch(addErrorNotification(updateQuestionError.message));
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
            else dispatch(addErrorNotification(removeChoicesError.message));
          }

          if (!removed) return;
        }

        if (newChoices.length > 0) {
          const [added, addChoicesError] = await addChoices(quiz.id, question.id, newChoices, token);

          if (addChoicesError) {
            if (addChoicesError.status === 403) router.push('/login');
            else dispatch(addErrorNotification(addChoicesError.message));
          }

          if (!added) return;
        }
      } else {
        const [added, addChoicesError] = await addChoices(quiz.id, question.id, choices, token);

        if (addChoicesError) {
          if (addChoicesError.status === 403) router.push('/login');
          else dispatch(addErrorNotification(addChoicesError.message));
        }

        if (!added) return;
      }
    }

    dispatch(addSuccessNotification('Question modifiée.'));
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
  notFoundRedirect: '/professor/quizzes',
};

const Question = (): ReactElement => {
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

  const { loading } = useLoading([quizState, questionState, authState, specificationState], [question, quiz, specifications]);

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

  return loading ? (
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
