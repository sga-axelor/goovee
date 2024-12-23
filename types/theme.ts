export type Theme = {
  colors?: {
    background?: string;
    foreground?: string;

    card?: string;
    'card-foreground'?: string;

    popover?: string;
    'popover-foreground'?: string;

    primary?: string;
    'primary-foreground'?: string;

    secondary?: string;
    'secondary-foreground'?: string;

    muted?: string;
    'muted-foreground'?: string;

    accent?: string;
    'accent-foreground'?: string;

    'destructive-light'?: string;
    destructive?: string;
    'destructive-dark'?: string;
    'destructive-foreground'?: string;

    'success-light'?: string;
    success?: string;
    'success-dark'?: string;
    'success-foreground'?: string;

    gray?: string;
    'gray-light'?: string;
    'gray-dark'?: string;

    border?: string;
    input?: string;
    ring?: string;

    palette?: Record<string, Record<string, string>>;
  };
  radius?: string;
};

export type ColorPalette =
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
