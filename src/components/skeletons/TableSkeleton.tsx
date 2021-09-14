import { v4 as uuidv4 } from 'uuid';

import type { ReactElement } from 'react';

import React from 'react';
import clsx from 'clsx';

import TextSkeleton from '@skeleton/TextSkeleton';
import IconSkeleton from '@skeleton/IconSkeleton';

import { generateArray } from '@util/generate.utils';

interface IProps {
  attributes: Array<[name: string, attribute: string]>;
  action?: boolean;
}

const TableSkeleton = ({ attributes, action }: IProps): ReactElement => {
  return (
    <table className="table-fixed w-full mt-14">
      <thead>
        <tr>
          {attributes.map(([name, slug]) => (
            <td className={clsx(['px-4 py-3 text-black border-t border-gray-300 text-sm'], slug === 'id' && 'w-2/24')} key={uuidv4()}>
              {slug === 'id' ? <TextSkeleton width={12} height={5} /> : <TextSkeleton width={32} height={5} />}
            </td>
          ))}
          {action && <td className="w-2/24 px-4 py-3 text-black border-t border-gray-300 text-sm"></td>}
        </tr>
      </thead>

      <tbody>
        {generateArray(8, 1).map((arr) => (
          <tr key={uuidv4()}>
            {attributes.map(([name, slug], index) => (
              <td className={clsx(['px-4 py-3 text-black border-t border-gray-300 text-sm'], slug === 'id' && 'w-2/24')} key={uuidv4()}>
                {slug === 'id' ? <TextSkeleton width={12} height={5} /> : <TextSkeleton width={32} height={5} />}
              </td>
            ))}

            {action && (
              <td className="px-4 py-3 text-black border-t border-gray-300 text-sm" key={uuidv4()}>
                <div className="flex justify-center w-full">
                  <IconSkeleton size={5} color="red" />
                </div>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
