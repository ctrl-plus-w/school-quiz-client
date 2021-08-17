import { v4 as uuidv4 } from 'uuid';

import { ReactElement, useState } from 'react';

import React from 'react';
import clsx from 'clsx';

import TextSkeleton from '@skeleton/TextSkeleton';
import IconSkeleton from '@skeleton/IconSkeleton';

import { randomSizeArray } from '@util/generate.utils';
import { random } from '@util/array.utils';

interface IProps {
  attributes: Array<[name: string, attribute: string]>;
}

const TableSkeleton = ({ attributes }: IProps): ReactElement => {
  const generateTable = () =>
    randomSizeArray(1, 9, 0).map((el) => {
      const xArr = [];

      for (let i = 0; i < attributes.length; i++) {
        xArr.push(random([24, 28, 32, 36, 40, 44, 48]));
      }

      return xArr;
    });

  const [fakeDataArray] = useState(generateTable());

  return (
    <table className="table-fixed w-full mt-14">
      <thead>
        <tr>
          {attributes.map(([name, slug]) => (
            <td className={clsx(['px-4 py-3 text-black border-t border-gray-300 text-sm'], slug === 'id' && 'w-2/24')} key={uuidv4()}>
              {slug === 'id' ? <TextSkeleton width={12} height={5} /> : <TextSkeleton randomWidth max={48} height={5} />}
            </td>
          ))}
          <td className="w-2/24 px-4 py-3 text-black border-t border-gray-300 text-sm"></td>
        </tr>
      </thead>

      <tbody>
        {fakeDataArray.map((arr) => (
          <tr key={uuidv4()}>
            {attributes.map(([name, slug], index) => (
              <td className={clsx(['px-4 py-3 text-black border-t border-gray-300 text-sm'], slug === 'id' && 'w-2/24')} key={uuidv4()}>
                {slug === 'id' ? <TextSkeleton width={12} height={5} /> : <TextSkeleton width={arr[index]} height={5} />}
              </td>
            ))}

            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm" key={uuidv4()}>
              <div className="flex justify-center w-full">
                <IconSkeleton size={5} color="red" />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
