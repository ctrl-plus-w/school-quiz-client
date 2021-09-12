import Router from 'next/router';

import { useEffect, useState } from 'react';

interface IConfig extends ILoadHookConfig {
  refetchNullValuesToCheck?: Array<any>;
}

const useLoad = (
  computeCb: (fail: VoidFunction, redirect: ILoadHookRedirectFunction) => Promise<void>,

  cbs: Array<VoidFunction> = [],

  config?: IConfig
): ILoadHookReturnProperties => {
  const [runner, setRunner] = useState(false);
  const [loading, setLoading] = useState(true);

  const run = () => {
    setRunner(true);
    setLoading(true);
  };

  useEffect(() => {
    const fail = () => {
      Router.push('/login');
    };

    const redirect = (path = '/login') => {
      config && config.notFoundRedirect ? Router.push(path) : fail();
    };

    (async () => {
      if (!runner) return;

      const compute = async () => {
        await computeCb(fail, redirect);
      };

      if (!config || !config.doNotRefetch) {
        await compute();
      } else if (
        config.doNotRefetch &&
        config.refetchNullValuesToCheck &&
        config.refetchNullValuesToCheck.every((value) => value === null || (Array.isArray(value) && value.length === 0))
      ) {
        await compute();
      }

      if (cbs) for (const cb of cbs) cb();

      setLoading(false);
      setRunner(false);
    })();
  }, [runner]);

  return { state: loading ? 'LOADING' : 'FULFILLED', run };
};

export default useLoad;
