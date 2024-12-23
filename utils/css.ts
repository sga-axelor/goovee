import {twMerge} from 'tailwind-merge';
import {ColorPalette, Theme} from '@/types/theme';
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

      --destructive-light: ${options?.colors?.['destructive-light']};
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
      --palette-purple-light: ${options?.colors?.palette?.purple?.light};
      --palette-purple-dark: ${options?.colors?.palette?.purple?.dark};

      --palette-blue: ${options?.colors?.palette?.blue?.default};
      --palette-blue-light: ${options?.colors?.palette?.blue?.light};
      --palette-blue-dark: ${options?.colors?.palette?.blue?.dark};

      --palette-yellow: ${options?.colors?.palette?.yellow?.default};
      --palette-yellow-light: ${options?.colors?.palette?.yellow?.light};
      --palette-yellow-dark: ${options?.colors?.palette?.yellow?.dark};

      --palette-orange: ${options?.colors?.palette?.orange?.default};
      --palette-orange-light: ${options?.colors?.palette?.orange?.light};
      --palette-orange-dark: ${options?.colors?.palette?.orange?.dark};

      --palette-pink: ${options?.colors?.palette?.pink?.default};
      --palette-pink-light: ${options?.colors?.palette?.pink?.light};
      --palette-pink-dark: ${options?.colors?.palette?.pink?.dark};

      --palette-indigo: ${options?.colors?.palette?.indigo?.default};
      --palette-indigo-light: ${options?.colors?.palette?.indigo?.light};
      --palette-indigo-dark: ${options?.colors?.palette?.indigo?.dark};

      --palette-red: ${options?.colors?.palette?.red?.default};
      --palette-red-light: ${options?.colors?.palette?.red?.light};
      --palette-red-dark: ${options?.colors?.palette?.red?.dark};

      --palette-lightblue: ${options?.colors?.palette?.lightblue?.default};
      --palette-lightblue-light: ${options?.colors?.palette?.lightblue?.light};
      --palette-lightblue-dark: ${options?.colors?.palette?.lightblue?.dark};

      --palette-cyan: ${options?.colors?.palette?.cyan?.default};
      --palette-cyan-light: ${options?.colors?.palette?.cyan?.light};
      --palette-cyan-dark: ${options?.colors?.palette?.cyan?.dark};

      --palette-teal: ${options?.colors?.palette?.teal?.default};
      --palette-teal-light: ${options?.colors?.palette?.teal?.light};
      --palette-teal-dark: ${options?.colors?.palette?.teal?.dark};

      --palette-green: ${options?.colors?.palette?.green?.default};
      --palette-green-light: ${options?.colors?.palette?.green?.light};
      --palette-green-dark: ${options?.colors?.palette?.green?.dark};

      --palette-lightgreen: ${options?.colors?.palette?.lightgreen?.default};
      --palette-lightgreen-light: ${options?.colors?.palette?.lightgreen?.light};
      --palette-lightgreen-dark: ${options?.colors?.palette?.lightgreen?.dark};

      --palette-lime: ${options?.colors?.palette?.lime?.default};
      --palette-lime-light: ${options?.colors?.palette?.lime?.light};
      --palette-lime-dark: ${options?.colors?.palette?.lime?.dark};

      --palette-amber: ${options?.colors?.palette?.amber?.default};
      --palette-amber-light: ${options?.colors?.palette?.amber?.light};
      --palette-amber-dark: ${options?.colors?.palette?.amber?.dark};

      --palette-deeporange: ${options?.colors?.palette?.deeporange?.default};
      --palette-deeporange-light: ${options?.colors?.palette?.deeporange?.light};
      --palette-deeporange-dark: ${options?.colors?.palette?.deeporange?.dark};
      
      --palette-brown: ${options?.colors?.palette?.brown?.default};
      --palette-brown-light: ${options?.colors?.palette?.brown?.light};
      --palette-brown-dark: ${options?.colors?.palette?.brown?.dark};

      --palette-grey: ${options?.colors?.palette?.grey?.default};
      --palette-grey-light: ${options?.colors?.palette?.grey?.light};
      --palette-grey-dark: ${options?.colors?.palette?.grey?.dark};

      --palette-bluegrey: ${options?.colors?.palette?.bluegrey?.default};
      --palette-bluegrey-light: ${options?.colors?.palette?.bluegrey?.light};
      --palette-bluegrey-dark: ${options?.colors?.palette?.bluegrey?.dark};

      --palette-black: ${options?.colors?.palette?.black?.default};
      --palette-black-light: ${options?.colors?.palette?.black?.light};
      --palette-black-dark: ${options?.colors?.palette?.black?.dark};

      --palette-white: ${options?.colors?.palette?.white?.default};
      --palette-white-light: ${options?.colors?.palette?.white?.light};
      --palette-white-dark: ${options?.colors?.palette?.white?.dark};

      --palette-deeppurple: ${options?.colors?.palette?.deeppurple?.default};
      --palette-deeppurple-light: ${options?.colors?.palette?.deeppurple?.light};
      --palette-deeppurple-dark: ${options?.colors?.palette?.deeppurple?.dark};
    }
    `;
}
