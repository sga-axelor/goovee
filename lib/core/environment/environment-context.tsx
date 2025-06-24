'use client';

import React, {useContext, useEffect, useState} from 'react';
import axios from 'axios';

const EnvironmentContext = React.createContext<any>({});

const rest = axios.create();

const store = (() => {
  let variables: Record<string, string> = {};

  const setVariables = (values: any) => {
    variables = {
      ...values,
    };
  };

  const getVariables = () => {
    return variables;
  };

  return {
    setVariables,
    getVariables,
  };
})();

export const getEnv = () => store.getVariables();

export function Environment({children}: {children: React.ReactNode}) {
  const [loading, setLoading] = useState(true);
  const [environment, setEnvironment] = useState({});

  useEffect(() => {
    const getEnvironment = async () => {
      const result = await rest
        .get(`/api/config`)
        .then(result => result?.data || {})
        .catch(() => ({}))
        .finally(() => {
          setLoading(false);
        });

      setEnvironment(result);
      store.setVariables(result);
    };

    getEnvironment();
  }, []);

  if (loading) {
    return null;
  }

  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}

export default Environment;
