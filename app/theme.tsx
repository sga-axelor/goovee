'use client';

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {generateCSSVariableString} from '@/utils/css';
import type {ThemeOptions} from '@/types/theme';
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

  useEffect(() => {
    if (!options) return;

    if (Object.keys(options).length === 0) {
      return;
    }

    const cssVariables = generateCSSVariableString(options);

    const styleElement = document.createElement('style');
    styleElement.textContent = cssVariables;
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
