import { useState } from 'react';

import type { ReactElement } from 'react';

import React from 'react';

import useInterval from '@hooks/useInterval';

import { getTimeFromMs } from '@util/date.utils';
import { formatNumber } from '@util/mapper.utils';

interface IProps {
  startDate?: Date;

  className?: string;
}

const getTimeFromMsFormated = (date: Date) => {
  return getTimeFromMs(Date.now() - date.valueOf()).map(formatNumber);
};

const Counter = ({ className, startDate = new Date(0) }: IProps): ReactElement => {
  const [counter, setCounter] = useState(getTimeFromMsFormated(startDate));

  useInterval(() => setCounter(getTimeFromMsFormated(startDate)), 1000);

  return (
    <div className={className}>
      <h1 className="font-semibold font-mono">
        {!(counter[0] == '00') && <span>{counter[0]} : </span>}

        {!(counter[0] == '00' && counter[1] == '00') && <span>{counter[1]} : </span>}

        <span>
          {counter[2]} : {counter[3]}
        </span>
      </h1>
    </div>
  );
};

export default Counter;
