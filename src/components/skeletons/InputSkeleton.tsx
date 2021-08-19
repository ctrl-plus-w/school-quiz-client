import type { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

import TextSkeleton from '@skeleton/TextSkeleton';

interface IProps {
  maxLength?: boolean;
  textArea?: boolean;

  className?: string;

  small?: boolean;
}

// ! Using 'box-content my-px' to simulate the space created on the real real input w/ the border.

const InputSkeleton = ({ maxLength, small, textArea }: IProps): ReactElement => {
  return (
    <div className={clsx(['form-control flex flex-col w-80'])}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <TextSkeleton width={small ? 12 : 32} height={5} />
        </div>

        <div className={clsx(['w-full box-content py-px mt-2 bg-gradient-to-br from-gray-300 to-gray-100 rounded', textArea ? 'h-17' : 'h-9'])}></div>

        {maxLength && (
          <div className="flex justify-end w-full mt-0.5">
            <TextSkeleton width={8} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InputSkeleton;
