import type { ReactElement } from 'react';

import Image from 'next/image';
import React from 'react';

import LandingPage from '@layout/LandingPage';

import Row from '@module/Row';

import examplePicture from '../../public/create_question_page.png';

const Home = (): ReactElement => {
  return (
    <LandingPage>
      <div className="flex flex-col w-full h-full p-20 bg-gray-100 overflow-hidden">
        <Row className="h-full">
          <div className="flex flex-col justify-center items-start gap-4 h-full w-1/2 p-8">
            <h1 className="font-semibold text-black text-5xl leading-normal">
              <span className="text-white bg-black rounded px-4 py-1">Testez</span> facilement <br />
              vos élèves.
            </h1>

            <p className="font-normal text-gray-900 font-base leading-normal">
              Imaginez une plateforme où vous pouvez tester vos élèves facilement grâce à une haute flexibilitée dans la création des questions.
            </p>
          </div>

          <div className="relative flex items-center w-1/2 h-full">
            <div className="relative left-32 h-5/6 w-full shadow-2xl rounded overflow-hidden">
              <Image src={examplePicture} alt="Image d'exemple." layout="fill" objectFit="cover" className="object-left-top" />
            </div>
          </div>
        </Row>
      </div>
    </LandingPage>
  );
};

export default Home;
