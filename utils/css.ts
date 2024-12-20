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

      --destructive-light: ${options?.colors?.['destructive-light']};
      --destructive: ${options?.colors?.destructive};
      --destructive-dark: ${options?.colors?.['destructive-dark']};
      --destructive-foreground: ${options?.colors?.['destructive-foreground']};

      --success-light: ${options?.colors?.['success-light']};
      --success: ${options?.colors?.success};
      --success-dark: ${options?.colors?.['success-dark']};
      --success-foreground: ${options?.colors?.['success-foreground']};
      --success-light:${options?.colors?.['success-light']};

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

      --palette-orange: ${options?.colors?.palette?.orange?.default};
      --palette-orange-dark: ${options?.colors?.palette?.orange?.dark};

      --palette-pink: ${options?.colors?.palette?.pink?.default};
      --palette-pink-dark: ${options?.colors?.palette?.pink?.dark}

    }
    `;
}

export type Color =
  | 'indigo'
  | 'red'
  | 'blue'
  | 'lightblue'
  | 'cyan'
  | 'teal'
  | 'pink'
  | 'green'
  | 'lightgreen'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'deeporange'
  | 'brown'
  | 'grey'
  | 'bluegrey'
  | 'black'
  | 'white'
  | 'purple'
  | 'deeppurple'
  | 'default';

export const colorPalette: Record<
  Color,
  {base: string; light: string; dark: string}
> = {
  indigo: {base: '#3f51b5', light: '#e8eaf6', dark: '#303f9f'},
  red: {base: '#f44336', light: '#ffcdd2', dark: '#d32f2f'},
  blue: {base: '#2196f3', light: '#bbdefb', dark: '#1976d2'},
  lightblue: {base: '#03a9f4', light: '#b2ebf2', dark: '#0288d1'},
  cyan: {base: '#00bcd4', light: '#80deea', dark: '#00838f'},
  teal: {base: '#009688', light: '#80cbc4', dark: '#00796b'},
  pink: {base: '#e91e63', light: '#f48fb1', dark: '#c2185b'},
  green: {base: '#4caf50', light: '#c8e6c9', dark: '#388e3c'},
  lightgreen: {base: '#8bc34a', light: '#dcedc8', dark: '#689f38'},
  lime: {base: '#cddc39', light: '#e6ee9c', dark: '#a4c639'},
  yellow: {base: '#ffeb3b', light: '#fff9c4', dark: '#fbc02d'},
  amber: {base: '#ffc107', light: '#ffe082', dark: '#ff9800'},
  orange: {base: '#ff9800', light: '#ffcc80', dark: '#f57c00'},
  deeporange: {base: '#ff5722', light: '#ffccbc', dark: '#e64a19'},
  brown: {base: '#795548', light: '#d7ccc8', dark: '#5d4037'},
  grey: {base: '#9e9e9e', light: '#efefef', dark: '#757575'},
  bluegrey: {base: '#607d8b', light: '#b0bec5', dark: '#455a64'},
  black: {base: '#000000', light: '#333333', dark: '#000000'},
  white: {base: '#ffffff', light: '#f5f5f5', dark: '#e0e0e0'},
  purple: {base: '#9c27b0', light: '#e1bee7', dark: '#8e24aa'},
  deeppurple: {base: '#673ab7', light: '#d1c4e9', dark: '#512da8'},
  default: {base: '#bdbdbd', light: '#f5f5f5', dark: '#616161'},
};

export const generateColorStyles = (color: Color) => {
  const {dark} = colorPalette[color] || colorPalette.default;
  const backgroundColor = dark;
  const textColor = color === 'white' ? '#333333' : '#ffffff';

  return {
    backgroundColor,
    textColor,
  };
};
