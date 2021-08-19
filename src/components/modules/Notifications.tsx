import type { FunctionComponent } from 'react';

import React from 'react';

import Notification from '@element/Notification';

import useAppSelector from '@hooks/useAppSelector';

import { selectNotifications } from '@redux/notificationSlice';

const Notifications: FunctionComponent = () => {
  const notifications = useAppSelector(selectNotifications);

  return (
    <div className="fixed z-50 top-0 lef-0 w-full h-full py-12 px-12 flex flex-col items-end justify-start pointer-events-none">
      {notifications.map((notification) => (
        <Notification notification={notification} key={notification.id}>
          {notification.content}
        </Notification>
      ))}
    </div>
  );
};

export default Notifications;
