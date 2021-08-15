import { FunctionComponent, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';

import { contextDefaultValues, NotificationContext } from './NotificationContext';

interface IProps {
  children?: React.ReactNode;
}

const NotificationProvider: FunctionComponent<IProps> = ({ children }: IProps) => {
  const [notifications, setNotifications] = useState<Array<UINotification>>(contextDefaultValues.notifications);

  const addNotification = (notification: UINotification) => {
    setNotifications((prev) => [...prev, { ...notification, id: uuidv4() }]);
  };

  const removeNotification = (notification: UINotification) => {
    setNotifications((prev) => prev.filter((_notification) => _notification.id !== notification.id));
  };

  return <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>{children}</NotificationContext.Provider>;
};
export default NotificationProvider;
