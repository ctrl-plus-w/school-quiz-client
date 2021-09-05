import React from 'react';

import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline';

export default {
  ERROR: {
    CLASSNAME: 'border-red-600 text-red-600',
    ICON: <XCircleIcon className="w-5 h-5 mx-3" />,
    TITLE: 'Erreur',
  },

  WARNING: {
    CLASSNAME: 'border-yellow-500 text-yellow-500',
    ICON: <XCircleIcon className="w-5 h-5 mx-3" />,
    TITLE: 'Attention',
  },

  INFO: {
    CLASSNAME: 'border-blue-600 text-blue-600',
    ICON: <CheckCircleIcon className="w-5 h-5 mx-3" />,
    TITLE: 'Information',
  },

  SUCCESS: {
    CLASSNAME: 'border-green-600 text-green-600',
    ICON: <ExclamationCircleIcon className="w-5 h-5 mx-3" />,
    TITLE: 'Information',
  },
};
