import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@redux/store';

interface INotificationState {
  notifications: Array<UINotification>;
}

const initialState: INotificationState = {
  notifications: [],
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
    removeNotification: removeNotificationReducer,
    clearNotification: clearNotificationsReducer,
  },
});

export const { addNotification, clearNotification, removeNotification } = notificationSlice.actions;

export const selectNotifications = (state: RootState): Array<UINotification> => state.notification.notifications;

export default notificationSlice.reducer;
