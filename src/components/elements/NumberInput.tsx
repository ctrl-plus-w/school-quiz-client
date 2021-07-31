import React, { ChangeEvent, ReactElement } from 'react';

interface IProps {
  placeholder?: string;
  label: string;

  className?: string;

  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}

const NumberInput = ({ label, placeholder, className, value, setValue }: IProps): ReactElement => {
  const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(parseInt(e.target.value));
  };

  return (
    <div className={`form-control flex flex-col w-80 ${className}`}>
      <label className="text-sm font-semibold uppercase text-gray-900">
        {label}

        <input
          type="number"
          className="block border border-gray-500 rounded-sm w-full py-2 px-3 mt-2 outline-none focus:outline-none"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete="off"
        />

        <div></div>
      </label>
    </div>
  );
};

export default NumberInput;
