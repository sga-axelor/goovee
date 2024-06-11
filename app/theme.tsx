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
     const DEFAULT_THEME_OPTIONS: any = {
      palette: {
        primary: '#6200EE',
        secondary: '#03DAC6',
        error: '#B00020',
        warning: '#FBC02D',
        info: '#2196F3',
        success: '#4CAF50',
      },
      typography: {
        body: {
          fontFamily: 'Roboto, sans-serif',
          fontSize: '16px',
          lineHeight: '1.5',
          fontWeight: '400',
          color: '#333333',
        },
        code: {
          fontFamily: 'Source Code Pro, monospace',
          fontSize: '14px',
          lineHeight: '1.6',
          fontWeight: '400',
          color: '#D32F2F',
        },
      },
      background: '#FFFFFF',
      foreground: '#0a0a0a',
      primary: {
        DEFAULT: '#212323',
        foreground: '#ffffff',
      },
      secondary: {
        DEFAULT: '#f5f5f5',
        foreground: '#212323',
      },
      destructive: {
        DEFAULT: '#ef4444',
        foreground: '#ffffff',
      },
      muted: {
        DEFAULT: '#f5f5f5',
        foreground: '#737373',
      },
      accent: {
        DEFAULT: '#f5f5f5',
        foreground: '#212323',
      },
      popover: {
        DEFAULT: '#ffffff',
        foreground: '#0a0a0a',
      },
      card: {
        DEFAULT: '#ffffff',
        foreground: '#0a0a0a',
      },
      border: {
        width: '1px',
        style: 'solid',
        color: '#e5e5e5',
      },
      link: {
        color: '#1E88E5',
        hover: '#1565C0',
        decoration: 'underline',
      },
      components: {
        Input: {
          color: '#000000',
          padding: '8px 12px',
          border: {
            width: '1px',
            style: 'solid',
            color: '#9E9E9E',
          },
          border_sm: {
            width: '1px',
            style: 'solid',
            color: '#9E9E9E',
          },
          border_lg: {
            width: '2px',
            style: 'solid',
            color: '#9E9E9E',
          },
          border_width: '1px',
          focus: {
            border: {
              width: '1px',
              style: 'solid',
              color: '#1E88E5',
            },
            border_width: '2px',
            shadow: '0 0 5px rgba(30, 136, 229, 0.5)',
          },
          invalid: {
            color: '#D32F2F',
            border: {
              width: '1px',
              style: 'solid',
              color: '#D32F2F',
            },
            border_width: '1px',
          },
          invalid_focus: {
            color: '#D32F2F',
            border: {
              width: '1px',
              style: 'solid',
              color: '#D32F2F',
            },
            border_width: '2px',
            shadow: '0 0 5px rgba(211, 47, 47, 0.5)',
          },
          placeholder: {
            color: '#9E9E9E',
          },
        },
        Form: {
          padding: '16px',
          gap: '16px',
          rowGap: '16px',
          columnGap: '16px',
        },
        Shell: {
          color: '#000000',
          background: '#FFFFFF',
          scrollbar: {
            color: '#B0BEC5',
          },
          sidebar: {
            background: '#263238',
            color: '#FFFFFF',
          },
          view: {
            toolbar: {
              background: '#F5F5F5',
              color: '#000000',
            },
            content: {
              background: '#FFFFFF',
              color: '#000000',
            },
          },
        },
        Panel: {
          color: '#000000',
          background: '#FFFFFF',
          title: {
            padding: '16px',
            margin: '0',
          },
          header: {
            background: '#EEEEEE',
            color: '#000000',
          },
          footer: {
            background: '#EEEEEE',
            color: '#000000',
          },
        },
        Table: {
          color: '#000000',
          background: '#FFFFFF',
          header: {
            background: '#F5F5F5',
            color: '#000000',
          },
          row: {
            background: '#FFFFFF',
            color: '#000000',
          },
          row_odd: {
            background: '#F9F9F9',
            color: '#000000',
          },
          row_hover: {
            background: '#E0E0E0',
            color: '#000000',
          },
          row_active: {
            background: '#EEEEEE',
            color: '#000000',
          },
          cell: {
            padding: '8px',
            margin: '0',
          },
          cell_active: {
            background: '#E0E0E0',
            color: '#000000',
          },
        },
        NavMenu: {
          color: '#000000',
          background: '#FFFFFF',
          width: '250px',
          zIndex: 1000,
          header: {
            color: '#FFFFFF',
            background: '#6200EE',
            padding: '16px',
            margin: '0',
          },
          item: {
            color: '#000000',
            background: '#FFFFFF',
            padding: '12px 16px',
            margin: '0',
            border: {
              width: '1px',
              style: 'solid',
              color: '#EEEEEE',
            },
          },
          item_hover: {
            color: '#FFFFFF',
            background: '#6200EE',
          },
          item_active: {
            color: '#FFFFFF',
            background: '#03DAC6',
          },
          icon: {
            color: '#6200EE',
            background: '#FFFFFF',
            padding: '8px',
            margin: '0',
          },
          icon_hover: {
            color: '#FFFFFF',
            background: '#6200EE',
          },
          icon_active: {
            color: '#FFFFFF',
            background: '#03DAC6',
          },
          buttons: {
            color: '#FFFFFF',
            background: '#6200EE',
            padding: '12px 16px',
            margin: '0',
            width: '100%',
          },
        },
        NavTabs: {
          color: '#000000',
          background: '#FFFFFF',
          item: {
            color: '#000000',
            background: '#FFFFFF',
          },
          item_hover: {
            color: '#6200EE',
            background: '#E0E0E0',
          },
          item_active: {
            color: '#FFFFFF',
            background: '#6200EE',
          },
          icon: {
            color: '#000000',
            background: '#FFFFFF',
            padding: '8px',
            margin: '0',
          },
          icon_hover: {
            color: '#6200EE',
            background: '#E0E0E0',
          },
          icon_active: {
            color: '#FFFFFF',
            background: '#6200EE',
          },
          text: {
            padding: '8px',
            margin: '0',
            transform: 'uppercase',
          },
          indicator: {
            bg: '#6200EE',
            height: '2px',
          },
        },
        CommandBar: {
          button: {
            color: '#000000',
            background: '#FFFFFF',
          },
          button_hover: {
            color: '#FFFFFF',
            background: '#6200EE',
            border: {
              width: '1px',
              style: 'solid',
              color: '#6200EE',
            },
          },
          button_active: {
            color: '#FFFFFF',
            background: '#03DAC6',
            border: {
              width: '1px',
              style: 'solid',
              color: '#03DAC6',
            },
            shadow: '0 0 5px rgba(3, 218, 198, 0.5)',
          },
          divider: {
            color: '#E0E0E0',
          },
        },
        Dropdown: {
          color: '#000000',
          background: '#FFFFFF',
          item: {
            color: '#000000',
            background: '#FFFFFF',
            padding: '8px 16px',
            margin: '0',
          },
          item_hover: {
            color: '#FFFFFF',
            background: '#6200EE',
          },
          item_active: {
            color: '#FFFFFF',
            background: '#03DAC6',
          },
          header: {
            color: '#FFFFFF',
            background: '#6200EE',
            padding: '8px 16px',
            margin: '0',
          },
          divider: {
            color: '#E0E0E0',
          },
        },
        NavSelect: {
          item: {
            color: '#000000',
            background: '#FFFFFF',
          },
          item_hover: {
            color: '#FFFFFF',
            background: '#6200EE',
          },
          item_active: {
            color: '#FFFFFF',
            background: '#03DAC6',
          },
        },
        Badge: {
          color: '#FFFFFF',
          background: '#6200EE',
          opacity: 0.8,
          primary: {
            color: '#6200EE',
          },
          secondary: {
            color: '#03DAC6',
          },
          success: {
            color: '#4CAF50',
          },
          danger: {
            color: '#D32F2F',
          },
          warning: {
            color: '#FBC02D',
          },
          info: {
            color: '#2196F3',
          },
          light: {
            color: '#F5F5F5',
          },
          dark: {
            color: '#212121',
          },
        },
        Button: {
          padding: '8px 16px',
          margin: '4px',
        },
      },
    };
    
    let cssVar = generateCssVar(DEFAULT_THEME_OPTIONS);
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
