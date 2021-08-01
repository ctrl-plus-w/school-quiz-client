import React, { ReactElement, useState } from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import TableRow from '@element/TableRow';

type MapperFunction = (value: any) => string;

interface IProps<T, K> {
  data: Array<T>;
  attributes: Array<[name: string, attribute: K, mapper?: MapperFunction]>;
  apiName: string;
}

const Table = <T extends { id: number }, K extends keyof T>({ attributes, data, apiName }: IProps<T, K>): ReactElement => {
  const [shownElement, setShownElement] = useState(-1);

  return (
    <table className="table-fixed w-full mt-14">
      <thead>
        <tr>
          {attributes.map(([name, slug]) => (
            <td className={clsx(['px-4 py-3 text-black border-t border-gray-300 text-sm'], slug === 'id' && 'w-2/24')} key={uuidv4()}>
              {name}
            </td>
          ))}
          <td className="w-2/24 px-4 py-3 text-black border-t border-gray-300 text-sm"></td>
        </tr>
      </thead>

      <tbody>
        {data.map((instance) => (
          <TableRow<T, K>
            instance={instance}
            attributes={attributes}
            key={uuidv4()}
            shownElement={shownElement}
            setShownElement={setShownElement}
            apiName={apiName}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
