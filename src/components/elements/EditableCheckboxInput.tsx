import { ChangeEvent, Dispatch, ReactElement, SetStateAction, useState } from 'react';

import React from 'react';
import clsx from 'clsx';

import { choiceSorter } from '@helpers/question.helper';

interface IRadioInputProps {
  id: number;
  value?: string;
  placeholder: string;

  maxLength?: number;

  checked: boolean;

  setValue: (value: string) => void;
  setChecked: (id: number, value: boolean) => void;
}

const CheckboxInput = ({ id, checked, value = '', setValue, setChecked, placeholder, maxLength }: IRadioInputProps): ReactElement => {
  const [tempValue, setTempValue] = useState(value);

  const handleInputchange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTempValue(e.target.value);
    setValue(e.target.value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(id, e.target.checked);
  };

  return (
    <div className="flex items-center mb-1">
      <label
        className={clsx([
          'w-3 h-3 border rounded-sm transition-all duration-100 cursor-pointer hover:ring',
          checked ? 'bg-green-600 border-green-800 hover:ring-green-200 ' : 'bg-gray-400 border-gray-600 hover:ring-gray-300 ',
        ])}
      >
        <input type="checkbox" checked={checked} onChange={handleCheckboxChange} hidden />
      </label>

      <input
        type="text"
        className="ml-2 outline-none focus:outline-none"
        placeholder={placeholder}
        value={tempValue}
        onChange={handleInputchange}
        autoComplete="off"
        maxLength={maxLength}
      />
    </div>
  );
};

interface IProps {
  label: string;
  placeholder: string;

  maxLength?: number;

  values: Array<EditableInputValue>;
  setValues: Dispatch<SetStateAction<Array<EditableInputValue>>>;
}

const EditableCheckboxInput = ({ label, placeholder, values, setValues, maxLength }: IProps): ReactElement => {
  const setValue = (id: number, value: string): void => {
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest, { ...el, name: value }] : prev;
    });
  };

  const setChecked = (id: number, value: boolean): void => {
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest, { ...el, checked: value }] : prev;
    });
  };

  return (
    <div className="form-control flex flex-col w-80">
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className="flex mt-2 flex-col items-start">
          {values.sort(choiceSorter).map(({ id, checked, name }) => (
            <CheckboxInput
              id={id}
              placeholder={placeholder}
              value={name}
              setValue={(v) => setValue(id, v)}
              setChecked={setChecked}
              checked={checked}
              maxLength={maxLength}
              key={id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditableCheckboxInput;
