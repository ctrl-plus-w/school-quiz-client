import React, { FunctionComponent, useContext } from 'react';

import Notification from '@element/Notification';

import { NotificationContext } from 'context/NotificationContext/NotificationContext';

const Notifications: FunctionComponent = () => {
  const { notifications, removeNotification } = useContext(NotificationContext);

  return (
    <div className="fixed z-50 top-0 lef-0 w-full h-full py-12 px-12 flex flex-col items-end justify-start pointer-events-none">
      {notifications.map((notification) => (
        <Notification notification={notification} removeNotification={removeNotification} key={notification.id}>
          {notification.content}
        </Notification>
      ))}
    </div>
  );
};

export default Notifications;
