import { useEffect, useState } from 'react';

import type { ChangeEvent, Dispatch, ReactElement, SetStateAction } from 'react';

import React from 'react';
import clsx from 'clsx';

import { formatNumber, str } from '@util/mapper.utils';

import REGEX from '@constant/regex';

interface IProps {
  label: string;

  className?: string;

  value: [string, string];
  setValue: Dispatch<SetStateAction<[string, string]>>;
}

const TimeInput = ({ label, className, value, setValue }: IProps): ReactElement => {
  const [hours, setHours] = useState(formatNumber(value[0]));
  const [minutes, setMinutes] = useState(formatNumber(value[1]));

  const [tempHours, setTempHours] = useState(hours);
  const [tempMinutes, setTempMinutes] = useState(minutes);

  useEffect(() => {
    setValue([hours, minutes]);
  }, [hours, minutes]);

  const handleHoursChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') return setHours('');

    if (!e.target.validity.valid) return;

    setHours(value);
    value !== '' && setTempHours(value);
  };

  const handleMinutesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') return setMinutes('');
    if (!e.target.validity.valid) return;

    setMinutes(value);
    value !== '' && setTempMinutes(value);
  };

  const handleHoursBlur = () => {
    if (hours === '') setHours(formatNumber(tempHours));
    else setHours((prev) => formatNumber(prev));
  };

  const handleMinutesBlur = () => {
    if (minutes === '') setMinutes(formatNumber(tempMinutes));
    else setMinutes((prev) => formatNumber(prev));
  };

  return (
    <div className={clsx(['form-control flex flex-col w-full', className])}>
      <label className="text-sm font-semibold text-gray-900">
        <div>
          <p className="uppercase">{label}</p>
        </div>

        <div className="form-input--np items-center">
          <input
            type="text"
            className="w-full py-2 pr-1 text-right outline-none"
            pattern={str(REGEX.hour)}
            value={hours}
            onChange={handleHoursChange}
            onBlur={handleHoursBlur}
          />

          <p className="font-normal text-black">h</p>

          <input
            type="text"
            className="w-full py-2 pl-1 text-left outline-none"
            pattern={str(REGEX.minutes)}
            value={minutes}
            onChange={handleMinutesChange}
            onBlur={handleMinutesBlur}
          />
        </div>
      </label>
    </div>
  );
};

export default TimeInput;
