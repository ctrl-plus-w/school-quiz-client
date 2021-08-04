import React, { ChangeEvent, Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

interface IRadioInputProps {
  id: string;
  inputName: string;
  placeholder: string;

  maxLength?: number;

  checked: boolean;

  setValue: (value: string) => void;
  setChecked: (id: string, value: boolean) => void;
}

const CheckboxInput = ({ id, inputName, checked, setValue, setChecked, placeholder, maxLength }: IRadioInputProps): ReactElement => {
  const [tempValue, setTempValue] = useState('');

  const handleInputchange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTempValue(e.target.value);
    setValue(e.target.value);
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(id, e.target.checked);
  };

  return (
    <div className="flex mb-0.5">
      <input type="checkbox" name={inputName} checked={checked} onChange={handleCheckboxChange} />

      <input
        type="text"
        className="ml-2 outline-none focus:outline-none"
        placeholder={placeholder}
        value={tempValue}
        onChange={handleInputchange}
        autoComplete="off"
        maxLength={maxLength}
      />

      {maxLength && (
        <div className="flex justify-end w-full mt-0.5">
          <p className="text-gray-500 font-medium text-xs">
            {tempValue.length}/{maxLength}
          </p>
        </div>
      )}
    </div>
  );
};

interface IProps {
  label: string;
  placeholder: string;

  maxLength?: number;

  values: EditableInputValues;
  setValues: Dispatch<SetStateAction<EditableInputValues>>;
}

const EditableCheckboxInput = ({ label, placeholder, values, setValues, maxLength }: IProps): ReactElement => {
  const [inputName] = useState(uuidv4());

  const setValue = (id: string, value: string): void => {
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest, { ...el, name: value }] : prev;
    });
  };

  const setChecked = (id: string, value: boolean): void => {
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest, { ...el, checked: value }] : prev;
    });
  };

  return (
    <div className={`form-control flex flex-col w-80`}>
      <div className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className="flex mt-2 flex-col items-start">
          {values
            .sort(({ id }, { id: _id }) => id.localeCompare(_id))
            .map(({ id, checked }) => (
              <CheckboxInput
                id={id}
                placeholder={placeholder}
                inputName={inputName}
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
