import { createContext } from 'react';

export const contextDefaultValues: NotificationContextState = {
  notifications: [],
  addNotification: (notifications: UINotification) => null,
  removeNotification: (notifications: UINotification) => null,
};

export const NotificationContext = createContext<NotificationContextState>(contextDefaultValues);
