import { v4 as uuidv4 } from 'uuid';

import type { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

import { generateArray } from '@util/generate.utils';

export const warnMapper = (warns?: Array<IWarn>): ReactElement => {
  const amount = warns && warns[0] ? Math.min(warns[0].amount, 3) : 0;

  return (
    <div className="flex gap-2">
      {generateArray(amount, 0).map((_, index) => (
        <div className={clsx(['w-4 h-4 rounded-full', index < 2 && 'bg-yellow-500', index === 2 && 'bg-red-600'])} key={uuidv4()}></div>
      ))}

      {generateArray(3 - amount, 0).map(() => (
        <div className="w-4 h-4 bg-gray-400 rounded-full" key={uuidv4()}></div>
      ))}
    </div>
  );
};
