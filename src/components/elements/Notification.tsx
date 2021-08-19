import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (removeNotification) {
      setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);
    }
  }, []);

  return (
    <div
      className={clsx(['flex items-center px-3 py-3 mb-4 border rounded-sm cursor-pointer pointer-events-auto shadow-xl', NOTIF.CLASSNAME])}
      onClick={() => dispatch(removeNotification(notification.id))}
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
