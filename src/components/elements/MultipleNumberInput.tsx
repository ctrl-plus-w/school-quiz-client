import React, { ChangeEvent, Dispatch, KeyboardEvent, ReactElement, SetStateAction, useEffect, useState } from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import { XIcon } from '@heroicons/react/outline';
import regex from '@constant/regex';
import { str } from '@util/mapper.utils';

interface IInputProps {
  placeholder?: string;
  suffix?: string;
  className?: string;

  min?: number;
  max?: number;

  pattern: string;

  value: string;
  setValue: Dispatch<SetStateAction<string>>;

  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const Input = ({ placeholder, className = '', suffix, pattern, onKeyDown, value, setValue, min, max }: IInputProps): ReactElement => {
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === '') return setValue('');

    if (!e.target.validity.valid) return;

    if (min && parseInt(e.target.value) < min) return;
    if (max && parseInt(e.target.value) > max) return;

    setValue(e.target.value);
  };

  return (
    <div className={clsx(['flex items-center px-3 mt-2 border border-gray-500 rounded-sm', className])}>
      <input
        type="text"
        className={clsx(['w-full py-2 outline-none focus:outline-none', suffix && 'text-right'])}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        pattern={pattern}
      />
      {suffix && <p className="text-gray-900 text-sm font-normal ml-1">{suffix}</p>}
    </div>
  );
};

interface IProps {
  label: string;
  placeholder?: string;

  className?: string;

  type: 'nombre-entier' | 'nombre-decimal' | string;

  values: Array<string>;
  setValues: Dispatch<SetStateAction<Array<string>>>;
}

const MultipleNumberInput = ({ className, label, type, placeholder = undefined, values, setValues }: IProps): ReactElement => {
  const [tempValue, setTempValue] = useState('');

  useEffect(() => {
    setTempValue('');
    setValues([]);
  }, [type]);

  const addValue = (value: string): void => {
    setValues((prev) => [...prev, value]);
  };

  const removeValue = (value: string): void => {
    setValues((prev) => prev.filter((_value) => _value !== value));
  };

  const handleInput = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key !== 'Enter') return;

    e.preventDefault();
    e.stopPropagation();

    if (type === 'date' && !regex.date.test(tempValue)) return setTempValue('');

    addValue(tempValue);
    setTempValue('');
  };

  const getInput = (): ReactElement => {
    const props = { onKeyDown: handleInput, value: tempValue, setValue: setTempValue };

    switch (type) {
      case 'nombre-entier':
        return <Input pattern={str(regex.integer)} placeholder="0" {...props} />;

      case 'nombre-decimal':
        return <Input pattern={str(regex.float)} placeholder="0.00" {...props} />;

      case 'pourcentage':
        return <Input pattern={str(regex.percent)} placeholder="00" suffix="%" {...props} />;

      case 'date':
        return <Input pattern={str(regex.dateInput)} placeholder="dd/mm/yyyy" {...props} />;

      default:
        return <Input pattern={str(regex.float)} placeholder="0" {...props} />;
    }
  };

  return (
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <label className="relative text-sm font-semibold text-gray-900">
        <div className="flex items-center">
          <span className="uppercase mr-2">{label}</span>
        </div>

        {getInput()}

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

export default MultipleNumberInput;
