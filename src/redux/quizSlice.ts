import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IQuizState {
  quizzes: Array<IQuiz>;
  tempQuiz: IQuiz | null;
}

const initialState: IQuizState = {
  quizzes: [],
  tempQuiz: null,
};

const addQuizzesReducer = (state: IQuizState, action: PayloadAction<Array<IQuiz>>) => {
  state.quizzes = state.quizzes.concat(action.payload);
};

const clearQuizzesReducer = (state: IQuizState) => {
  state.quizzes = [];
};

const removeQuizReducer = (state: IQuizState, action: PayloadAction<number>) => {
  state.quizzes = state.quizzes.filter((quiz) => quiz.id !== action.payload);
};

const setTempQuizReducer = (state: IQuizState, action: PayloadAction<IQuiz>) => {
  state.tempQuiz = action.payload;
};

const clearTempQuizReducer = (state: IQuizState) => {
  state.tempQuiz = null;
};

const quizSlice = createSlice({
  name: 'quiz',

  initialState: initialState,

  reducers: {
    setTempQuiz: setTempQuizReducer,
    clearTempQuiz: clearTempQuizReducer,
    addQuizzes: addQuizzesReducer,
    removeQuiz: removeQuizReducer,
    clearQuizzes: clearQuizzesReducer,
  },
});

export const { addQuizzes, clearQuizzes, setTempQuiz, clearTempQuiz, removeQuiz } = quizSlice.actions;

export const selectQuizzes = (state: RootState): Array<IQuiz> => state.quiz.quizzes;
export const selectTempQuiz = (state: RootState): IQuiz | null => state.quiz.tempQuiz;

export default quizSlice.reducer;
