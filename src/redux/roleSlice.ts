import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IRoleState {
  roles: Array<IRole>;

  tempRole: IRole | null;
}

const initialState: IRoleState = {
  roles: [],

  tempRole: null,
};

const addRolesReducer = (state: IRoleState, action: PayloadAction<Array<IRole>>) => {
  state.roles = state.roles.concat(action.payload);
};

const removeRoleReducer = (state: IRoleState, action: PayloadAction<number>) => {
  state.roles = state.roles.filter((role) => role.id !== action.payload);
};

const setTempRoleReducer = (state: IRoleState, action: PayloadAction<IRole>) => {
  state.tempRole = action.payload;
};

const clearRolesReducer = (state: IRoleState) => {
  state.roles = [];
};

const clearTempRoleReducer = (state: IRoleState) => {
  state.tempRole = null;
};

const roleSlice = createSlice({
  name: 'role',

  initialState: initialState,

  reducers: {
    addRoles: addRolesReducer,
    removeRole: removeRoleReducer,
    setTempRole: setTempRoleReducer,
    clearRoles: clearRolesReducer,
    clearTempRole: clearTempRoleReducer,
  },
});

export const { addRoles, clearRoles, clearTempRole, removeRole, setTempRole } = roleSlice.actions;

export const selectRoles = (state: RootState): Array<IRole> => state.role.roles;
export const selectTempRole = (state: RootState): IRole | null => state.role.tempRole;

export default roleSlice.reducer;
