import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IQuizState {
  quizzes: Array<IQuiz>;
}

const initialState: IQuizState = {
  quizzes: [],
};

const addQuizzesReducer = (state: IQuizState, action: PayloadAction<Array<IQuiz>>) => {
  state.quizzes = state.quizzes.concat(action.payload);
};

const clearQuizzesReducer = (state: IQuizState) => {
  state.quizzes = [];
};

const quizSlice = createSlice({
  name: 'quiz',

  initialState: initialState,

  reducers: {
    addQuizzes: addQuizzesReducer,
    clearQuizzes: clearQuizzesReducer,
  },
});

export const { addQuizzes, clearQuizzes } = quizSlice.actions;

export const selectQuizzes = (state: RootState): Array<IQuiz> | null => state.quiz.quizzes;

export default quizSlice.reducer;
