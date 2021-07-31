import React, { FunctionComponent, useEffect, useRef } from 'react';

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

  const getColor = () => {
    return NOTIF.CLASSNAME;
  };

  const getIcon = () => {
    return NOTIF.ICON;
  };

  const getTitle = () => {
    return NOTIF.TITLE;
  };

  return (
    <div
      className={`flex items-center px-3 py-3 mb-4 border ${getColor()} rounded-sm cursor-pointer pointer-events-auto`}
      onClick={() => removeNotification(notification)}
    >
      {getIcon()}

      <div className="flex flex-col ml-1">
        <p className="text-sm font-semibold">{getTitle()}</p>
        <p className="text-sm">{children}</p>
      </div>
    </div>
  );
};

export default Notification;
