import { v4 as uuidv4 } from 'uuid';

import type { ReactElement } from 'react';

import Link from 'next/link';
import React from 'react';

import Layout from '@layout/Default';

import Button from '@element/Button';

interface IProps {
  children?: ReactElement;
}

const MENU = [
  { name: 'Accueil', path: '/' },
  { name: 'En savoir plus', path: 'en-savoir-plus' },
  { name: 'Contact', path: 'contact' },
];

const LandingPage = ({ children }: IProps): ReactElement => {
  return (
    <Layout title="Accueil" display="col">
      <nav className="flex justify-between items-center w-full px-12 py-6">
        <Link href="/">
          <a className="font-bold text-2xl text-black italic">school quiz</a>
        </Link>

        <ul className="flex items-center gap-8 text-black">
          {MENU.map((link) => (
            <li key={uuidv4()} className="hover:text-blue-700 transition-all duration-200 cursor-pointer">
              <Link href={link.path}>
                <a>{link.name}</a>
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/login" passHref={true}>
          <Button type="black" full={false}>
            Connexion
          </Button>
        </Link>
      </nav>

      {children}
    </Layout>
  );
};

export default LandingPage;
