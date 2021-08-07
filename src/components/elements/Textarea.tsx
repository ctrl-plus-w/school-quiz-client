import clsx from 'clsx';
import React, { ChangeEvent, ReactElement } from 'react';

interface IProps {
  placeholder?: string;
  label: string;
  note?: string;

  maxLength?: number;

  className?: string;

  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const Textarea = ({ label, placeholder, className, value, setValue, note, maxLength }: IProps): ReactElement => {
  const onChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setValue(e.target.value);
  };

  return (
    <div className={clsx(['form-control flex flex-col w-80', className])}>
      <label className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <textarea
          className="form-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
          maxLength={maxLength}
        ></textarea>

        {maxLength && (
          <div className="flex justify-end w-full mt-0.5">
            <p className="text-gray-500 font-medium text-xs">
              {value.length}/{maxLength}
            </p>
          </div>
        )}

        {note && (
          <div className="w-full mt-0.5">
            <small className="text-gray-600 text-xs font-medium italic">{note}</small>
          </div>
        )}
      </label>
    </div>
  );
};

export default Textarea;
