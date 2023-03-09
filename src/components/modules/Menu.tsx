import { useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { useCookies } from 'react-cookie';
import { v4 as uuidv4 } from 'uuid';

import { FunctionComponent } from 'react';

import React from 'react';
import clsx from 'clsx';

import { LogoutIcon, ChevronLeftIcon } from '@heroicons/react/outline';

import MenuItem from '@element/MenuItem';

import useAppDispatch from '@hooks/useAppDispatch';

import { clearQuestions, clearTempQuestion } from '@redux/questionSlice';
import { clearEvents, clearTempEvent } from '@redux/eventSlice';
import { clearQuizzes, clearTempQuiz } from '@redux/quizSlice';
import { clearGroups } from '@redux/groupSlice';
import { clearUsers } from '@redux/userSlice';

interface IProps {
  links: Array<ILink>;
  logoutButton?: boolean;
}

const Menu: FunctionComponent<IProps> = ({ links, logoutButton = false }: IProps) => {
  const [_cookie, _setCookie, removeCookie] = useCookies(['user']);

  const router = useRouter();

  const dispatch = useAppDispatch();

  const [closed, setClosed] = useState(false);

  const handleClick = () => {
    removeCookie('user');

    dispatch(clearTempEvent());
    dispatch(clearTempQuiz());
    dispatch(clearTempQuestion());

    dispatch(clearEvents());
    dispatch(clearQuizzes());
    dispatch(clearQuestions());
    dispatch(clearGroups());
    dispatch(clearUsers());

    router.push('/login');
  };

  return (
    <div className="flex flex-col justify-between px-10 py-16 border-r border-gray-300 flex-shrink-0 flex-grow-0 transition-all duration-300">
      <div className="flex justify-start mb-16 cursor-pointer" onClick={() => setClosed((prev) => !prev)}>
        <ChevronLeftIcon className={clsx(['w-7 h-7 transition-all duration-300', closed && 'transform rotate-180'])} />
      </div>

      <ul className="flex flex-col gap-6 h-full">
        {links.map((props) => (
          <MenuItem {...props} key={uuidv4()} closed={closed} />
        ))}

        {logoutButton && (
          <li className="mt-auto text-gray-black hover:text-blue-800 transition-all duration-300">
            <a className="flex gap-3 font-medium text-base mt-auto cursor-pointer" onClick={handleClick}>
              <LogoutIcon className="w-6 h-6" />
              {!closed && 'Se déconnecter'}
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
