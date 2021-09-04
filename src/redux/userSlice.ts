import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IUserState {
  user: IUser | null;

  users: Array<IUser>;

  professors: Array<IUser>;
}

const initialState: IUserState = {
  user: null,

  users: [],

  professors: [],
};

const setUserReducer = (state: IUserState, action: PayloadAction<IUser>) => {
  state.user = action.payload;
};

const addUsersReducer = (state: IUserState, action: PayloadAction<Array<IUser>>) => {
  const newUsers = action.payload.filter((user) => !state.users.some((_user) => user.id === _user.id));
  state.users = state.users.concat(newUsers);
};

const replaceOrAddUserReducer = (state: IUserState, action: PayloadAction<IUser>) => {
  if (state.users.some((user) => user.id === action.payload.id)) {
    state.users = state.users.filter((user) => user.id != action.payload.id).concat(action.payload);
  } else {
    state.users = state.users.concat(action.payload);
  }
};

const clearUsersReducer = (state: IUserState) => {
  state.users = [];
};

const addProfessorsReducer = (state: IUserState, action: PayloadAction<Array<IUser>>) => {
  const newProfessors = action.payload.filter((user) => !state.professors.some((_user) => user.id === _user.id));
  state.professors = state.professors.concat(newProfessors);
};

const clearProfessorsReducer = (state: IUserState) => {
  state.professors = [];
};

const userSlice = createSlice({
  name: 'user',

  initialState: initialState,

  reducers: {
    setUser: setUserReducer,
    addUsers: addUsersReducer,
    replaceOrAddUser: replaceOrAddUserReducer,
    clearUsers: clearUsersReducer,
    addProfessors: addProfessorsReducer,
    clearProfessors: clearProfessorsReducer,
  },
});

export const { setUser, addProfessors, addUsers, clearProfessors, clearUsers, replaceOrAddUser } = userSlice.actions;

export const selectUser = (state: RootState): IUser | null => state.user.user;
export const selectUsers = (state: RootState): Array<IUser> => state.user.users;
export const selectProfessors = (state: RootState): Array<IUser> => state.user.professors;

export default userSlice.reducer;
