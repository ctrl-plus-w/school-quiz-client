import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface IGroupState {
  groups: Array<IGroup>;
}

const initialState: IGroupState = {
  groups: [],
};

const addGroupsReducer = (state: IGroupState, action: PayloadAction<Array<IGroup>>) => {
  state.groups = state.groups.concat(action.payload);
};

const clearGroupsReducer = (state: IGroupState) => {
  state.groups = [];
};

const groupSlice = createSlice({
  name: 'group',

  initialState: initialState,

  reducers: {
    addGroups: addGroupsReducer,
    clearGroups: clearGroupsReducer,
  },
});

export const { addGroups, clearGroups } = groupSlice.actions;

export const selectGroups = (state: RootState): Array<IGroup> => state.group.groups;

export default groupSlice.reducer;
