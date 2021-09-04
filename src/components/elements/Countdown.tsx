import { ReactElement, useState } from 'react';

import clsx from 'clsx';
import React from 'react';
import { getTimeFromMs } from '@util/date.utils';
import useInterval from '@hooks/useInterval';
import { formatNumber } from '@util/mapper.utils';

interface IProps {
  until: Date;

  className?: string;
}

const getTimeFromMsFormated = (date: Date) => {
  return getTimeFromMs(date.valueOf() - Date.now()).map(formatNumber);
};

const Countdown = ({ until, className }: IProps): ReactElement => {
  const [diff, setDiff] = useState(getTimeFromMsFormated(until));

  const updateDiff = () => {
    setDiff(getTimeFromMsFormated(until));
  };

  useInterval(updateDiff, 1000);

  return (
    <div className={clsx('flex flex-row gap-3', className)}>
      <h1 className="font-semibold font-mono">
        {!(diff[0] == '00') && <span>{diff[0]} : </span>}

        {!(diff[0] == '00' && diff[1] == '00') && <span>{diff[1]} : </span>}

        <span>
          {diff[2]} : {diff[3]}
        </span>
      </h1>
    </div>
  );
};

export default Countdown;
