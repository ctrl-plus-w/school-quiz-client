import { configureStore } from '@reduxjs/toolkit';

import authSlice from '@redux/authSlice';
import userSlice from '@redux/userSlice';
import quizSlice from '@redux/quizSlice';
import eventSlice from '@redux/eventSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    quiz: quizSlice,
    event: eventSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
