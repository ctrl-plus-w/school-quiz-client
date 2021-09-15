import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IAuthState {
  token: string | null;

  user: IUser | null;
}

const initialState: IAuthState = {
  token: null,
  user: null,
};

const setTokenReducer = (state: IAuthState, action: PayloadAction<string>): void => {
  state.token = action.payload;
};

const setLoggedUserReducer = (state: IAuthState, action: PayloadAction<IUser>): void => {
  state.user = action.payload;
};

const authSlice = createSlice({
  name: 'auth',

  initialState: initialState,

  reducers: {
    setToken: setTokenReducer,
    setLoggedUser: setLoggedUserReducer,
  },
});

export const { setToken, setLoggedUser } = authSlice.actions;

export const selectToken = (state: RootState): string | null => state.auth.token;
export const selectLoggedUser = (state: RootState): IUser | null => state.auth.user;

export default authSlice.reducer;
