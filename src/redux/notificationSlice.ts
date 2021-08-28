import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface INotificationState {
  notifications: Array<UINotification>;
}

const initialState: INotificationState = {
  notifications: [],
};

const addInfoNotificationReducer = (state: INotificationState, action: PayloadAction<string>) => {
  state.notifications.push({ content: action.payload, type: 'INFO', id: uuidv4() });
};

const addErrorNotificationReducer = (state: INotificationState, action: PayloadAction<string>) => {
  state.notifications.push({ content: action.payload, type: 'ERROR', id: uuidv4() });
};

const addWarningNotificationReducer = (state: INotificationState, action: PayloadAction<string>) => {
  state.notifications.push({ content: action.payload, type: 'WARNING', id: uuidv4() });
};

const addSuccessNotificationReducer = (state: INotificationState, action: PayloadAction<string>) => {
  state.notifications.push({ content: action.payload, type: 'SUCCESS', id: uuidv4() });
};

const addNotificationReducer = (state: INotificationState, action: PayloadAction<UINotification>) => {
  state.notifications.push(action.payload);
};

const removeNotificationReducer = (state: INotificationState, action: PayloadAction<string>) => {
  state.notifications = state.notifications.filter((notification) => notification.id !== action.payload);
};

const clearNotificationsReducer = (state: INotificationState) => {
  state.notifications = [];
};

const notificationSlice = createSlice({
  name: 'notification',

  initialState: initialState,

  reducers: {
    addNotification: addNotificationReducer,
    addInfoNotification: addInfoNotificationReducer,
    addErrorNotification: addErrorNotificationReducer,
    addWarningNotification: addWarningNotificationReducer,
    addSuccessNotification: addSuccessNotificationReducer,
    removeNotification: removeNotificationReducer,
    clearNotification: clearNotificationsReducer,
  },
});

export const {
  addNotification,
  clearNotification,
  removeNotification,
  addErrorNotification,
  addInfoNotification,
  addSuccessNotification,
  addWarningNotification,
} = notificationSlice.actions;

export const selectNotifications = (state: RootState): Array<UINotification> => state.notification.notifications;

export default notificationSlice.reducer;
