// ---- CORE IMPORTS ---- //
import {isSameDay} from '@/utils/date';

// ---- LOCAL IMPORTS ---- //
import {Event} from '@/subapps/events/common/ui/components';

export const datesBetweenTwoDates = (data: Event[]): Date[] => {
  const Dates: Date[] = [];

  data.forEach((event: Event) => {
    const startDate = new Date(event.eventStartDateTime);
    const endDate = new Date(event.eventEndDateTime);
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      Dates.push(new Date(d.getFullYear(), d.getMonth(), d.getDate()));
    }
    Dates.push(
      new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()),
    );
  });

  const uniqueDates = Dates.filter(
    (date, index, self) => index === self.findIndex(d => isSameDay(d, date)),
  );

  return uniqueDates;
};

export function error(message: string) {
  return {
    error: true,
    message,
  };
}

export type ColorKey =
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
  | 'deeppurple';

export const colorDefinitions: Record<
  ColorKey,
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
};

export const getColorStyles = (color: ColorKey, isActive: boolean) => {
  const {light, dark} = colorDefinitions[color];

  const backgroundColor = isActive ? dark : light;
  const textColor =
    color === 'white'
      ? '#333333'
      : color === 'black'
        ? '#ffffff'
        : isActive
          ? '#ffffff'
          : '#333333';

  return {
    backgroundColor,
    textColor,
    hoverBackgroundColor: dark,
    hoverTextColor: color === 'white' ? '#333333' : '#ffffff',
  };
};
