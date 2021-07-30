import React, { FunctionComponent, useState } from 'react';

import { contextDefaultValues, NotificationContext } from './NotificationContext';

interface IProps {
  children?: React.ReactNode;
}

const NotificationProvider: FunctionComponent<IProps> = ({ children }: IProps) => {
  const [notifications, setNotifications] = useState<Array<UINotification>>(contextDefaultValues.notifications);

  const addNotification = (notification: UINotification) => {
    setNotifications((prev) => [...prev, notification]);
  };

  const removeNotification = (notification: UINotification) => {
    setNotifications((prev) => prev.filter((_notification) => _notification.id !== notification.id));
  };

  return <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>{children}</NotificationContext.Provider>;
};
export default NotificationProvider;
