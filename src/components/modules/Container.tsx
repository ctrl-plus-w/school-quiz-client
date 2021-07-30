import React, { FunctionComponent } from 'react';

import Route from '@element/Route';
import Subtitle from '@element/Subtitle';
import Title from '@element/Title';

interface IProps {
  children?: React.ReactNode;
  title: string;
  subtitle?: { name: string; path: string } | string;
  path?: string;
}

const Container: FunctionComponent<IProps> = ({ children, title, subtitle, path }: IProps) => {
  const getSubtitleElement = () => {
    if (subtitle) {
      return typeof subtitle === 'string' ? <Subtitle>{subtitle}</Subtitle> : <Route to={subtitle.path}>{subtitle.name}</Route>;
    } else {
      return null;
    }
  };

  const getPathElement = () => {
    return path ? <p className="text-gray-600 text-sm font-normal mb-2">{path}</p> : null;
  };

  return (
    <div className="relative flex flex-col py-12 px-12 h-full">
      <div>
        {getPathElement()}
        <Title>{title}</Title>
        {getSubtitleElement()}
      </div>

      {children}
    </div>
  );
};

export default Container;
