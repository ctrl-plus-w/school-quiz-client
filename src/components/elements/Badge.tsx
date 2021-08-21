import { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  type?: BadgeType;
  content: string;
}

const Badge = ({ type = 'DEFAULT', content }: IProps): ReactElement => {
  const getColor = () => {
    switch (type) {
      case 'WARNING':
        return 'bg-yellow-600';

      case 'ERROR':
        return 'bg-red-600';

      case 'INFO':
        return 'bg-blue-600';

      case 'SUCCESS':
        return 'bg-green-600';

      default:
        return 'bg-gray-600';
    }
  };

  return <span className={clsx(['ml-3 px-3 py-0.5 text-white text-xl font-semibold rounded', getColor()])}>{content}</span>;
};

export default Badge;
