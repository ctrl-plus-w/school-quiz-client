import { RootState } from '@redux/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import database from 'database/database';

type RequestState = 'PENDING' | 'FULFILLED';

export interface IAuthState {
  error: string | null;

  state: RequestState;

  userId: number | null;
  username: string | null;
  role: string | null;
  rolePermission: number | null;
  token: string | null;
}

type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  userId: number;
  username: string;
  role: string;
  rolePermission: number;
  token: string;
};

const initialState: IAuthState = {
  error: null,

  userId: null,
  username: null,
  role: null,
  rolePermission: null,
  token: null,

  state: 'PENDING',
};

export const login = createAsyncThunk('auth/login', async (payload: LoginPayload) => {
  const request = await database.post('/auth/login', payload);

  return {
    userId: request.data.userId,
    username: request.data.username,
    role: request.data.role,
    rolePermission: request.data.rolePermission,
    token: request.data.token,
  };
});

export const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      console.log({ ...state, error: null, ...action.payload });
      return { ...state, error: null, ...action.payload };
    });

    builder.addCase(login.pending, (state, _action) => {
      return { ...state, state: 'PENDING' };
    });

    builder.addCase(login.rejected, (state, _action) => {
      return { ...state, state: 'FULFILLED', error: 'Something wrong happened' };
    });
  },
});

export const selectState = (state: RootState) => state.auth.state;

export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
