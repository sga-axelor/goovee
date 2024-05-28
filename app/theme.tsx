"use client";

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@axelor/ui";
import { ThemeOptions } from "@axelor/ui/core/styles/theme/types";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import axios from "axios";
import generateCssVar from "@/utils/DynamicCssVar";

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
    [options, updateThemeOptions]
  );

  const getAndAllowThemeData = async () => {
    const theme = await axios.get("/api");
    if (theme?.status === 200) {
      try {
        let css = JSON.parse(theme?.data?.theme?.css);
        if (Object.keys(css).length) {
          let cssVar = generateCssVar(css);
          const styleElement = document.createElement("style");
          styleElement.appendChild(document.createTextNode(cssVar));
          document.head.appendChild(styleElement);
        }
      } catch (e) {
        console.log("problem while parsing the JSON using JSON.parse, ",e);
      }
    }
  };

  useEffect(() => {
    getAndAllowThemeData();
  }, []);

  return (
    <ThemeContext.Provider value={value}>
      <ThemeProvider options={options}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): any {
  return useContext(ThemeContext);
}
