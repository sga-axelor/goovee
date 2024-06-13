export const DEFAULT_THEME_OPTIONS = {
  colors: {
    border: '#E6E7E7',
    input: '#E6E7E7',
    ring: '#E6E7E7',
    body: {
      light: '#F8F9FA',
    },
    main: {
      purple: '#5603AD',
    },
    detail: {
      blue: '#464555',
    },
    link: {
      blue: '#2D60C4',
    },
    success: {
      light: '#D0EED8',
      dark: '#4FC179',
    },
    error: {
      light: '#FBC6C4',
      dark: '#F14E46',
    },
    warning: {
      light: '#FFE6BF',
      dark: '#FFA114',
    },
    primary: {
      light: '#F6F1FF',
      dark: '#5603AD',
      DEFAULT: '#212323',
      foreground: '#FFFFFF',
    },
    secondary: {
      light: '#D0E3FF',
      dark: '#2D60C4',
      DEFAULT: '#F5F5F5',
      foreground: '#212323',
    },
    default: {
      light: '#ADB5BD',
      dark: '#495057',
    },
    background: '#FFFFFF',
    foreground: '0 0% 3.92%',
    destructive: {
      DEFAULT: '#EF4444',
      foreground: '#FFFFFF',
    },
    muted: {
      DEFAULT: '#F5F5F5',
      foreground: '#737373',
    },
    accent: {
      DEFAULT: '#F5F5F5',
      foreground: '#212323',
    },
    card: {
      DEFAULT: '#FFFFFF',
      foreground: '#0A0A0A',
    },
    popover: {
      DEFAULT: '0 0% 100%',
      foreground: '0 0% 3.9%',
    },
  },
  borderWidth: {
    width: 'var(--width)',
    '0': '0',
    '2': '2px',
    '3': '3px',
    '4': '4px',
    '6': '6px',
    '8': '8px',
  },
  borderRadius: {
    sm: 'calc(var(--radius) - 2px)',
    md: 'calc(var(--radius) - -2px)',
    lg: 'calc(var(--radius) - -4px)',
    xl: 'calc(var(--radius) - -8px)',
    '2xl': 'calc(var(--radius) - -12px)',
    '3xl': 'calc(var(--radius) - -20px)',
  },
  fontFamily: {
    sans: ['var(--font-sans)', '...fontFamily.sans'],
  },
  keyframes: {
    'accordion-down': {
      from: {height: '0'},
      to: {height: 'var(--radix-accordion-content-height)'},
    },
    'accordion-up': {
      from: {height: 'var(--radix-accordion-content-height)'},
      to: {height: '0'},
    },
  },
};
