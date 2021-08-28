import { useEffect, useRef, useState } from 'react';

import type { FunctionComponent } from 'react';

import React from 'react';
import clsx from 'clsx';

import useAppDispatch from '@hooks/useAppDispatch';

import { removeNotification } from '@redux/notificationSlice';

import NOTIFICATION from '@constant/notification';

interface IProps {
  children?: React.ReactNode;

  notification: UINotification;
}

const Notification: FunctionComponent<IProps> = ({ children, notification }: IProps) => {
  const NOTIF = useRef(NOTIFICATION[notification.type]).current;

  const dispatch = useAppDispatch();

  const [fade, setFade] = useState(false);

  const closeNotification = () => {
    dispatch(removeNotification(notification.id));
  };

  useEffect(() => {
    setTimeout(() => closeNotification(), 5000);
  }, []);

  return (
    <div
      className={clsx([
        'flex items-center py-3 mb-4 rounded cursor-pointer pointer-events-auto shadow-md min-w-64 border-l-2 transition-all duration-500',
        fade && 'animate-fade-right',
        NOTIF.CLASSNAME,
      ])}
      onAnimationEnd={() => closeNotification()}
      onClick={() => setFade(true)}
    >
      {NOTIF.ICON}

      <div className="flex flex-col gap-1">
        <p className="text-gray-900 text-sm font-semibold">{NOTIF.TITLE}</p>
        <p className="text-gray-700 text-sm">{children}</p>
      </div>
    </div>
  );
};

export default Notification;
