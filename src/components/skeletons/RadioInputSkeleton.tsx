import { v4 as uuidv4 } from 'uuid';

import type { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

import TextSkeleton from '@skeleton/TextSkeleton';

import { generateArray } from '@util/generate.utils';

interface IProps {
  amount?: number;

  big?: boolean;
}

const RadioInputSkeleton = ({ amount = 2, big = false }: IProps): ReactElement => {
  return (
    <div className={clsx(['form-control flex flex-col w-80'])}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <TextSkeleton width={32} height={5} />
        </div>

        <div className={clsx(['flex mt-2 items-start', !big && 'flex-col'])}>
          {generateArray(amount, 1).map(() =>
            big ? (
              <div className="w-16 h-16 mr-4 rounded bg-gradient-to-br from-gray-300 to-gray-100" key={uuidv4()}></div>
            ) : (
              <div className="group flex items-center mb-0.5 cursor-pointer" key={uuidv4()}>
                <div className="w-3 h-3 border rounded-full mr-2 bg-gradient-to-br from-gray-300 to-gray-100 "></div>

                <TextSkeleton className="my-0.5" />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RadioInputSkeleton;
