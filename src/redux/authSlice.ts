import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IAuthState {
  token: string | null;
}

const initialState: IAuthState = {
  token: null,
};

const setTokenReducer = (state: IAuthState, action: PayloadAction<string>): void => {
  state.token = action.payload;
};

const authSlice = createSlice({
  name: 'auth',

  initialState: initialState,

  reducers: {
    setToken: setTokenReducer,
  },
});

export const { setToken } = authSlice.actions;

export const selectToken = (state: RootState): string | null => state.auth.token;

export default authSlice.reducer;
