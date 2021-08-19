import { configureStore } from '@reduxjs/toolkit';

import authSlice from '@redux/authSlice';
import userSlice from '@redux/userSlice';
import quizSlice from '@redux/quizSlice';
import eventSlice from '@redux/eventSlice';
import questionSlice from '@redux/questionSlice';
import groupSlice from '@redux/groupSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    quiz: quizSlice,
    event: eventSlice,
    question: questionSlice,
    group: groupSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
