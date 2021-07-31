import React, { ChangeEvent, ReactElement } from 'react';

interface IProps {
  placeholder?: string;
  label: string;
  note?: string;

  className?: string;

  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const NumberInput = ({ label, placeholder, className, value, setValue, note }: IProps): ReactElement => {
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(parseInt(e.target.value));
  };

  return (
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <label className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <input
          type="number"
          className="block border border-gray-500 rounded-sm w-full py-2 px-3 mt-2 outline-none focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />

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
