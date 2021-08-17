import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IUserState {
  user: IUser | null;
}

const initialState: IUserState = {
  user: null,
};

const setUserReducer = (state: IUserState, action: PayloadAction<IUser>) => {
  state.user = action.payload;
};

const userSlice = createSlice({
  name: 'user',

  initialState: initialState,

  reducers: {
    setUser: setUserReducer,
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState): IUser | null => state.user.user;

export default userSlice.reducer;
