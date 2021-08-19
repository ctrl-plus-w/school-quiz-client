import { ChangeEvent, Dispatch, FocusEvent, ReactElement, SetStateAction, useEffect, useState } from 'react';

import React from 'react';
import clsx from 'clsx';

import { str } from '@util/mapper.utils';

import REGEX from '@constant/regex';

interface IInputProps {
  placeholder?: string;
  suffix?: string;

  error?: boolean;

  min?: number;
  max?: number;

  pattern: string;

  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

const Input = ({ placeholder, suffix, pattern, value, setValue, min, max, error = false }: IInputProps): ReactElement => {
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.value === '') return setValue('');

    if (min && parseInt(e.target.value) < min) return;
    if (max && parseInt(e.target.value) > max) return;

    if (!e.target.validity.valid) return;

    setValue(e.target.value);
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>): void => {
    if (min && e.target.value === '') setValue(min.toString());
  };

  return (
    <div className={clsx(['form-input--ns px-3 mt-2 rounded-sm', error && 'error'])}>
      <input
        type="text"
        className={clsx(['w-full py-2 outline-none focus:outline-none', suffix && 'text-right'])}
        onChange={onChange}
        value={value}
        placeholder={placeholder}
        pattern={pattern}
        onBlur={onBlur}
      />

      {suffix && <p className="text-gray-900 text-sm font-normal py-2 ml-1">{suffix}</p>}
    </div>
  );
};

interface IProps {
  placeholder?: string;
  label: string;
  note?: string;
  error?: boolean;

  type: string;

  min?: number;
  max?: number;

  className?: string;

  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const NumberInput = ({ label, placeholder, type, className, value, setValue, note, min, max, error }: IProps): ReactElement => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) setValue(min ? min.toString() : '');
    else setLoaded(true);
  }, [type]);

  const getInput = () => {
    const props = { value, setValue, error };

    switch (type) {
      case 'nombre-entier':
        return <Input pattern={str(REGEX.integer)} placeholder="0" min={min} max={max} {...props} />;

      case 'nombre-decimal':
        return <Input pattern={str(REGEX.float)} placeholder="0.00" {...props} />;

      case 'pourcentage':
        return <Input pattern={str(REGEX.percent)} suffix="%" placeholder="000" {...props} />;

      case 'prix':
        return <Input pattern={str(REGEX.float)} suffix="€" placeholder="0.00" {...props} />;

      default:
        return <Input pattern={str(REGEX.integer)} placeholder="0" {...props} />;
    }
  };

  return (
    <div className={clsx(['form-control flex flex-col w-full', className])}>
      <label className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        {getInput()}

        {note && (
          <div className="w-full mt-0.5">
            <small className="text-gray-600 text-xs font-medium italic">{note}</small>
          </div>
        )}
      </label>
    </div>
  );
};

export default NumberInput;
