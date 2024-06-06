'use client';

import React, {useCallback, useContext, useMemo, useState} from 'react';
import {ThemeProvider} from '@axelor/ui';
import {ThemeOptions} from '@axelor/ui/core/styles/theme/types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ThemeContext = React.createContext({});

export default function Theme({
  children,
  options: optionsProp,
}: {
  children: React.ReactElement;
  options: ThemeOptions;
}) {
  const [options, setOptions] = useState(optionsProp);

  const updateThemeOptions = useCallback((options: ThemeOptions) => {
    setOptions(options);
  }, []);

  const value = useMemo(
    () => ({
      options,
      updateThemeOptions,
    }),
    [options, updateThemeOptions],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider options={options}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): any {
  return useContext(ThemeContext);
}
