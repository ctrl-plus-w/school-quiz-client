import React, { ReactElement } from 'react';
import { useRouter } from 'next/dist/client/router';

import { v4 as uuidv4 } from 'uuid';

type MapperFunction = (value: any) => string;

interface IProps<T, K> {
  data: Array<T>;
  attributes: Array<[name: string, attribute: K, mapper?: MapperFunction]>;
}

const Table = <T extends { id: number }, K extends keyof T>({ attributes, data }: IProps<T, K>): ReactElement => {
  const router = useRouter();

  const handleClick = (instance: T): void => {
    router.push({ pathname: `${router.pathname}/[id]`, query: { id: instance.id } });
  };

  return (
    <table className="table-auto w-full mt-14">
      <thead>
        <tr>
          {attributes.map(([name]) => (
            <td className="px-4 py-3 text-black border-t border-gray-300 text-sm" key={uuidv4()}>
              {name}
            </td>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((instance) => (
          <tr key={uuidv4()} className="group">
            {attributes.map(([_name, attribute, mapper]) => (
              <td
                className="px-4 py-3 cursor-pointer text-gray-500 text-sm border-t border-gray-300 group-hover:bg-gray-200"
                key={uuidv4()}
                onClick={() => handleClick(instance)}
              >
                {mapper ? mapper(instance[attribute]) : instance[attribute]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
