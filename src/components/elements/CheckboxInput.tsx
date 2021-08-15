import { Dispatch, ReactElement, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

import React from 'react';
import clsx from 'clsx';

interface IProps {
  label: string;
  className?: string;

  values: Array<{ name: string; checked: boolean; setValue: Dispatch<SetStateAction<boolean>> }>;
}

const CheckboxInput = ({ label, values, className }: IProps): ReactElement => {
  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className="flex mt-2 flex-col items-start">
          {values.map(({ name, checked, setValue }) => (
            <label className="group flex items-center mb-0.5 cursor-pointer" key={uuidv4()}>
              <input type="checkbox" className="hidden" checked={checked} onChange={() => setValue((prev) => !prev)} />

              <div
                className={clsx([
                  'w-3 h-3 border rounded-sm mr-2 group-hover:ring transition-all duration-100',
                  checked ? 'bg-green-600 border-green-800 group-hover:ring-green-200 ' : 'bg-gray-400 border-gray-600 group-hover:ring-gray-300 ',
                ])}
              ></div>

              <p className="text-gray-900 font-normal">{name}</p>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckboxInput;
