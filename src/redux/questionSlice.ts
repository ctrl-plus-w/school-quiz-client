import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IQuestionState {
  questions: Array<Question>;
  tempQuestion: Question | null;

  specifications: Array<IQuestionSpecification>;
}

const initialState: IQuestionState = {
  questions: [],
  tempQuestion: null,

  specifications: [],
};

const addQuestionsReducer = (state: IQuestionState, action: PayloadAction<Array<Question>>) => {
  state.questions = state.questions.concat(action.payload);
};

const clearQuestionsReducer = (state: IQuestionState) => {
  state.questions = [];
};

const setTempQuestionReducer = (state: IQuestionState, action: PayloadAction<Question>) => {
  state.tempQuestion = action.payload;
};

const clearTempQuestionReducer = (state: IQuestionState) => {
  state.tempQuestion = null;
};

const addSpecificationsReducer = (state: IQuestionState, action: PayloadAction<Array<IQuestionSpecification>>) => {
  state.specifications = state.specifications.concat(action.payload);
};

const clearSpecificationsReducer = (state: IQuestionState) => {
  state.specifications = [];
};

const questionSlice = createSlice({
  name: 'question',

  initialState: initialState,

  reducers: {
    setTempQuestion: setTempQuestionReducer,
    clearTempQuestion: clearTempQuestionReducer,

    addQuestions: addQuestionsReducer,
    clearQuestions: clearQuestionsReducer,

    addSpecifications: addSpecificationsReducer,
    clearSpecifications: clearSpecificationsReducer,
  },
});

export const { addQuestions, clearQuestions, setTempQuestion, clearTempQuestion, addSpecifications, clearSpecifications } = questionSlice.actions;

export const selectQuestions = (state: RootState): Array<Question> => state.question.questions;
export const selectTempQuestion = (state: RootState): Question | null => state.question.tempQuestion;
export const selectSpecifications = (state: RootState): Array<IQuestionSpecification> => state.question.specifications;

export default questionSlice.reducer;
