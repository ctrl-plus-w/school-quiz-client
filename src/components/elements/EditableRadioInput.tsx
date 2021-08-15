import clsx from 'clsx';
import { choiceSorter } from 'helpers/question.helper';
import React, { ChangeEvent, Dispatch, ReactElement, SetStateAction, useState } from 'react';

interface IRadioInputProps {
  id: number;
  value?: string;
  placeholder: string;

  maxLength?: number;

  checked: boolean;

  setValue: (value: string) => void;
  setChecked: (id: number) => void;
}

const RadioInput = ({ id, checked, value = '', setValue, setChecked, placeholder, maxLength }: IRadioInputProps): ReactElement => {
  const [tempValue, setTempValue] = useState(value);

  const handleInputchange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTempValue(e.target.value);
    setValue(e.target.value);
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(id);
  };

  return (
    <div className="flex items-center mb-1">
      <label
        className={clsx([
          'w-3 h-3 border rounded-full cursor-pointer',
          checked ? 'bg-gray-500 border-gray-900 text-gray-900' : 'bg-gray-400 border-gray-600 text-gray-600',
        ])}
      >
        <input type="radio" checked={checked} onChange={handleRadioChange} hidden />
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

const EditableRadioInput = ({ label, placeholder, values, setValues, maxLength }: IProps): ReactElement => {
  const [tempChecked, setTempChecked] = useState(values.find(({ checked }) => checked)?.id || '');

  const setValue = (id: number, value: string): void => {
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest, { ...el, name: value }] : prev;
    });
  };

  const setChecked = (id: number): void => {
    setTempChecked(id);
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest.map(({ ...props }) => ({ ...props, checked: false })), { ...el, checked: true }] : prev;
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
            <RadioInput
              id={id}
              placeholder={placeholder}
              setValue={(v) => setValue(id, v)}
              value={name}
              setChecked={setChecked}
              checked={tempChecked === id}
              maxLength={maxLength}
              key={id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditableRadioInput;
