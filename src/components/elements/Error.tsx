import { FunctionComponent } from 'react';

import React from 'react';

import Text from '@element/Text';

interface IProps {
  body: string;
}

const ErrorModal: FunctionComponent<IProps> = ({ body }: IProps) => {
  return (
    <div className="error flex flex-col py-3 px-3 bg-red-400 border border-red-700 w-full">
      <Text color="red" small>
        {body}
      </Text>
    </div>
  );
};

export default ErrorModal;
