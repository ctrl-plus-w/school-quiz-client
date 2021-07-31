import React, { FunctionComponent } from 'react';

import { v4 as uuidv4 } from 'uuid';

import Route from '@element/Route';
import Subtitle from '@element/Subtitle';
import Title from '@element/Title';
import Link from 'next/link';

interface IProps {
  children?: React.ReactNode;
  title: string;
  subtitle?: { name: string; path: string } | string;
  breadcrumb?: Array<{ name: string; path?: string }>;
}

const Container: FunctionComponent<IProps> = ({ children, title, subtitle, breadcrumb }: IProps) => {
  const getSubtitleElement = () => {
    if (subtitle) {
      return typeof subtitle === 'string' ? (
        <Subtitle className="mt-2">{subtitle}</Subtitle>
      ) : (
        <Route to={subtitle.path} className="mt-2">
          {subtitle.name}
        </Route>
      );
    } else {
      return null;
    }
  };

  const getBreadcrumbElement = () => {
    return breadcrumb ? (
      <p className="text-gray-600 text-sm font-normal mb-2">
        {breadcrumb.map(({ name, path }) =>
          path ? (
            <Link href={path} key={uuidv4()}>
              <a className="font-semibold">{name} &gt;</a>
            </Link>
          ) : (
            <span key={uuidv4()}> {name}</span>
          )
        )}
      </p>
    ) : null;
  };

  return (
    <div className="relative flex flex-col py-12 px-12 h-full">
      <div className="flex flex-col">
        {getBreadcrumbElement()}
        <Title>{title}</Title>
        {getSubtitleElement()}
      </div>

      {children}
    </div>
  );
};

export default Container;
