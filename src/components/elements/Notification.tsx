import React, { FunctionComponent, useEffect, useRef } from 'react';

import clsx from 'clsx';

import NOTIFICATION from '@constant/notification';

interface IProps {
  children?: React.ReactNode;
  notification: UINotification;

  removeNotification: (notification: UINotification) => void;
}

const Notification: FunctionComponent<IProps> = ({ children, notification, removeNotification }: IProps) => {
  const NOTIF = useRef(NOTIFICATION[notification.type]).current;

  useEffect(() => {
    if (removeNotification) {
      setTimeout(() => {
        removeNotification(notification);
      }, 5000);
    }
  }, []);

  return (
    <div
      className={clsx(['flex items-center px-3 py-3 mb-4 border rounded-sm cursor-pointer pointer-events-auto shadow-xl', NOTIF.CLASSNAME])}
      onClick={() => removeNotification(notification)}
    >
      {NOTIF.ICON}

      <div className="flex flex-col ml-1">
        <p className="text-sm font-semibold">{NOTIF.TITLE}</p>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
};

export default Notification;
