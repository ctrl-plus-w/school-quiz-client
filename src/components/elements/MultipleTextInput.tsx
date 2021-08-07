import React, { ChangeEvent, Dispatch, KeyboardEvent, ReactElement, SetStateAction, useState } from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import { XIcon } from '@heroicons/react/outline';

interface IProps {
  label: string;
  placeholder: string;

  maxLength?: number;

  className?: string;

  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
}

const MultipleTextInput = ({ className, label, placeholder, values, setValues, maxLength }: IProps): ReactElement => {
  const [tempValue, setTempValue] = useState('');

  const addValue = (str: string): void => {
    setValues((prev) => [...prev, str]);
  };

  const removeValue = (str: string): void => {
    setValues((prev) => prev.filter((val) => val !== str));
  };

  const handleInput = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter' || tempValue.length === 0) return;

    const target = e.target as HTMLInputElement;

    e.preventDefault();
    e.stopPropagation();

    addValue(target.value);
    setTempValue('');
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTempValue(e.target.value);
  };

  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <label className="relative text-sm font-semibold text-gray-900">
        <div className="flex items-center">
          <span className="uppercase mr-2">{label}</span>
        </div>

        <input
          type="text"
          className="w-full py-2 px-3 mt-2 border border-gray-500 rounded-sm outline-none focus:outline-none"
          placeholder={placeholder}
          onKeyDown={handleInput}
          value={tempValue}
          onChange={onChange}
          maxLength={maxLength}
        />

        <div className="flex flex-wrap w-full">
          {values.map((str) => (
            <div
              className="flex items-center py-0.75 pl-2 pr-1.5 mr-2 mt-2 bg-gray-300 border border-gray-500 rounded-sm cursor-pointer"
              onClick={() => removeValue(str)}
              key={uuidv4()}
            >
              <p className="text-gray-700 font-normal mr-1" key={uuidv4()}>
                {str}
              </p>

              <XIcon className="h-4 w-4 text-gray-700" />
            </div>
          ))}
        </div>
      </label>
    </div>
  );
};

export default MultipleTextInput;
