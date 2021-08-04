import React, { ChangeEvent, Dispatch, ReactElement, SetStateAction, useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

interface IRadioInputProps {
  id: string;
  inputName: string;
  placeholder: string;

  maxLength?: number;

  checked: boolean;

  setValue: (value: string) => void;
  setChecked: (id: string) => void;
}

const RadioInput = ({ id, inputName, checked, setValue, setChecked, placeholder, maxLength }: IRadioInputProps): ReactElement => {
  const [tempValue, setTempValue] = useState('');

  const handleInputchange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTempValue(e.target.value);
    setValue(e.target.value);
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(id);
  };

  return (
    <div className="flex mb-0.5">
      <input type="radio" name={inputName} checked={checked} onChange={handleRadioChange} />

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

  values: EditableInputValues;
  setValues: Dispatch<SetStateAction<EditableInputValues>>;
}

const EditableRadioInput = ({ label, placeholder, values, setValues, maxLength }: IProps): ReactElement => {
  const [inputName] = useState(uuidv4());

  const [tempChecked, setTempChecked] = useState('');

  const setValue = (id: string, value: string): void => {
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest, { ...el, name: value }] : prev;
    });
  };

  const setChecked = (id: string): void => {
    setTempChecked(id);
    setValues((prev) => {
      const el = prev.find(({ id: _id }) => _id === id);
      const rest = prev.filter(({ id: _id }) => _id !== id);

      return el ? [...rest.map(({ ...props }) => ({ ...props, checked: false })), { ...el, checked: true }] : prev;
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
              <RadioInput
                id={id}
                placeholder={placeholder}
                inputName={inputName}
                setValue={(v) => setValue(id, v)}
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
