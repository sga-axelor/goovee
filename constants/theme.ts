import type {Theme} from '@/types/theme';

export const DEFAULT_THEME_OPTIONS: Theme = {
  colors: {
    background: '0 0% 100%',
    foreground: '222.2 84% 4.9%',

    card: '0 0% 100%',
    'card-foreground': '222.2 84% 4.9%',

    popover: '0 0% 100%',
    'popover-foreground': '222.2 84% 4.9%',

    primary: '222.2 47.4% 11.2%',
    'primary-foreground': '210 40% 98%',

    secondary: '237, 50%, 22%',
    'secondary-foreground': '0 0% 100',

    muted: '210 40% 96.1%',
    'muted-foreground': '215.4 16.3% 46.9%',

    accent: '210 40% 96.1%',
    'accent-foreground': '222.2 47.4% 11.2%',

    destructive: '0 84.2% 60.2%',
    'destructive-foreground': '210 40% 98%',
    'destructive-dark': '3 86% 61%',

    'success-light': '164 52% 94%',
    success: '153 60% 59%',
    'success-foreground': '210 40% 98%',
    'success-dark': '142 48% 37%',
    'success-light': '164 52% 94%',

    gray: '160 3% 82',
    'gray-light': '180 2% 90%',
    'gray-dark': '170 3% 36%',

    border: '214.3 31.8% 91.4%',
    input: '214.3 31.8% 91.4%',
    ring: '222.2 84% 4.9%',

    palette: {
      purple: {
        default: '261 100% 97%',
        dark: '269 97% 35%',
      },
      blue: {
        default: '216 100% 91%',
        dark: '220 63% 47%',
      },
      yellow: {
        default: '37 100% 87%',
        dark: '36 100% 54%',
      },
      orange: {
        default: '24.6 95% 53.1%',
        dark: '17.5 88.3% 40.4%',
      },
      pink: {
        default: '337 74% 91%',
        dark: '335 100% 54%',
      },
    },
  },
  radius: '0.5rem',
};
