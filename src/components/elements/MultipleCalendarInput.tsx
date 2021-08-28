import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

import type { Dispatch, ReactElement, SetStateAction } from 'react';

import React from 'react';
import clsx from 'clsx';

import { XIcon } from '@heroicons/react/outline';

import CalendarInput from '@element/CalendarInput';

import { formatDate, setTime } from '@util/date.utils';

interface IMultipleCalendarInput {
  label: string;

  className?: string;
  onlyFuture?: boolean;
  currentClickable?: boolean;

  values: Array<Date>;
  setValues: Dispatch<SetStateAction<Array<Date>>>;
}

const MultipleCalendarInput = ({ label, setValues, values, onlyFuture, className, currentClickable }: IMultipleCalendarInput): ReactElement => {
  const [date, setDate] = useState(setTime(new Date(), 0, 0, 0, 0));

  const addValue = (value: Date) => {
    setValues((prev) => [...prev, value]);
    setDate(setTime(new Date(), 0, 0, 0, 0));
  };

  const removeValue = (value: Date) => {
    setValues((prev) => prev.filter((_value) => value !== _value));
  };

  return (
    <CalendarInput label={label} value={date} setValue={setDate} cb={addValue} {...{ onlyFuture, currentClickable, className }}>
      <div className="flex flex-wrap w-full text-sm">
        {values.map((value) => (
          <div
            className={clsx([
              'flex items-center py-0.75 pl-2 pr-1.5 mr-2 mt-2 border rounded-sm cursor-pointer',
              'bg-gray-300 border-gray-500 hover:bg-red-200 hover:border-red-800 hover:text-red-800',
            ])}
            onClick={() => removeValue(value)}
            key={uuidv4()}
          >
            <p className="text-gray-700 font-normal mr-1" key={uuidv4()}>
              {formatDate(value)}
            </p>

            <XIcon className="h-4 w-4 text-gray-700" />
          </div>
        ))}
      </div>
    </CalendarInput>
  );
};

export default MultipleCalendarInput;
