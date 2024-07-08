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

    success: '153 60% 59%',
    'success-foreground': '210 40% 98%',

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
    },
  },
  radius: '0.5rem',
};
