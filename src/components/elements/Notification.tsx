import React, { FunctionComponent, useEffect, useState } from 'react';

import { CheckIcon } from '@heroicons/react/outline/';

interface IProps {
  children?: React.ReactNode;
  notification: UINotification;
  removeNotification: (notification: UINotification) => void;
}

const Notification: FunctionComponent<IProps> = ({ children, notification, removeNotification }: IProps) => {
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    else removeNotification(notification);
  }, [countdown]);

  const getColor = () => {
    switch (notification.type) {
      case 'error':
        return 'bg-red-100 border-red-600 text-red-600';

      default:
        return 'bg-green-100  border-green-600 text-green-600';
    }
  };

  return (
    <div
      className={`flex items-center px-3 py-3 mb-4 border ${getColor()} rounded-sm cursor-pointer pointer-events-auto`}
      onClick={() => removeNotification(notification)}
    >
      <CheckIcon className="w-5 h-5 mr-2 " />
      <p>{children}</p>
    </div>
  );
};

export default Notification;
