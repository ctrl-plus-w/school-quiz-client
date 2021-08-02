import React, { Dispatch, ReactElement, SetStateAction, useState } from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

interface IRadioInputProps {
  id: string;
  name: string;

  checked: boolean;

  setValue: () => void;
}

interface IProps<T> {
  values: Array<{ name: string; slug: T }>;
  label: string;
  big?: boolean;
  className?: string;

  value: T;
  setValue: Dispatch<SetStateAction<T>>;
}

const BigRadioInput = ({ id, name, checked, setValue }: IRadioInputProps) => {
  return (
    <label
      className={clsx([
        'flex justify-center items-center w-16 h-16 rounded-sm border mr-4 cursor-pointer transition-all duration-100',
        checked ? 'bg-gray-500 border-gray-900 text-gray-900' : 'bg-gray-400 border-gray-600 text-gray-600',
      ])}
    >
      <input type="radio" className="hidden" name={id} checked={checked} onChange={setValue} />

      <p>{name}</p>
    </label>
  );
};

const NormalRadioInput = ({ id, name, checked, setValue }: IRadioInputProps) => {
  return (
    <label className="flex items-center mb-0.5 cursor-pointer">
      <input type="radio" className="hidden" name={id} checked={checked} onChange={setValue} />

      <div
        className={clsx([
          'w-3 h-3 border rounded-full mr-2',
          checked ? 'bg-gray-500 border-gray-900 text-gray-900' : 'bg-gray-400 border-gray-600 text-gray-600',
        ])}
      ></div>

      <p className="text-gray-900 font-normal">{name}</p>
    </label>
  );
};

const RadioInput = <T,>({ label, values, value, setValue, big = false, className }: IProps<T>): ReactElement => {
  const [id] = useState(uuidv4());

  return (
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className={clsx('flex mt-2', big ? 'flex-row' : 'flex-col items-start')}>
          {values.map(({ name, slug }) => {
            const props: IRadioInputProps = { name, checked: value === slug, id, setValue: () => setValue(slug) };
            return big ? <BigRadioInput {...props} /> : <NormalRadioInput {...props} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RadioInput;
