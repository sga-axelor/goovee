'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {ThemeOptions} from '@axelor/ui/core/styles/theme/types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import generateCssVar from '@/utils/DynamicCssVar';

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

  useEffect(() => {
    if (!options || options === null || !Object.keys(options)?.length) return;
    let cssVar = generateCssVar(options);
    const styleElement = document.createElement('style');
    styleElement.appendChild(document.createTextNode(cssVar));
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, [options]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): any {
  return useContext(ThemeContext);
}
