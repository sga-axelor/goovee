import {twMerge} from 'tailwind-merge';
import {Theme} from '@/types/theme';
import {type ClassValue, clsx} from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCSSVariableString(options: Theme) {
  return `
    :root {
      --background: ${options?.colors?.background};
      --foreground: ${options?.colors?.foreground};

      --card: ${options?.colors?.card};
      --card-foreground: ${options?.colors?.['card-foreground']};

      --popover: ${options?.colors?.popover};
      --popover-foreground: ${options?.colors?.['popover-foreground']};

      --primary: ${options?.colors?.primary};
      --primary-foreground: ${options?.colors?.['primary-foreground']};

      --secondary: ${options?.colors?.secondary};
      --secondary-foreground: ${options?.colors?.['secondary-foreground']};

      --muted: ${options?.colors?.muted};
      --muted-foreground: ${options?.colors?.['muted-foreground']};

      --accent: ${options?.colors?.accent};
      --accent-foreground: ${options?.colors?.['accent-foreground']};

      --destructive: ${options?.colors?.destructive};
      --destructive-dark: ${options?.colors?.['destructive-dark']};
      --destructive-foreground: ${options?.colors?.['destructive-foreground']};

      --success-light: ${options?.colors?.['success-light']};
      --success: ${options?.colors?.success};
      --success-dark: ${options?.colors?.['success-dark']};
      --success-foreground: ${options?.colors?.['success-foreground']};

      --gray: ${options?.colors?.gray};
      --gray-light:${options?.colors?.['gray-light']};
      --gray-dark: ${options?.colors?.['gray-dark']};

      --border: ${options?.colors?.border};
      --input: ${options?.colors?.input};
      --ring: ${options?.colors?.ring};

      --radius: ${options?.radius};

      --palette-purple: ${options?.colors?.palette?.purple?.default};
      --palette-purple-dark: ${options?.colors?.palette?.purple?.dark};

      --palette-blue: ${options?.colors?.palette?.blue?.default};
      --palette-blue-dark: ${options?.colors?.palette?.blue?.dark};

      --palette-yellow: ${options?.colors?.palette?.yellow?.default};
      --palette-yellow-dark: ${options?.colors?.palette?.yellow?.dark};
    }
    `;
}
