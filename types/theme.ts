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

    destructive?: string;
    'destructive-dark'?: string;
    'destructive-foreground'?: string;

    'success-light'?: string;
    success?: string;
    'success-dark'?: string;
    'success-foreground'?: string;

    border?: string;
    input?: string;
    ring?: string;

    palette?: Record<string, Record<string, string>>;
  };
  radius?: string;
};
