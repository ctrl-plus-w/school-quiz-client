import React from 'react';

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline';

const ICON_CLASSNAME = 'w-5 h-5 mr-2';

export default {
  ERROR: {
    CLASSNAME: 'bg-red-100 border-red-600 text-red-600',
    ICON: <XCircleIcon className={ICON_CLASSNAME} />,
    TITLE: 'Erreur',
  },

  INFO: {
    CLASSNAME: 'bg-green-100 border-green-600 text-green-600',
    ICON: <CheckCircleIcon className={ICON_CLASSNAME} />,
    TITLE: 'Information',
  },
};
