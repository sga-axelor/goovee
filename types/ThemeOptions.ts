export type ThemeOptions = {
  colors?: {
    border?: string;
    input?: string;
    ring?: string;
    body?: {
      light?: string;
    };
    main?: {
      purple?: string;
    };
    detail?: {
      blue?: string;
    };
    link?: {
      blue?: string;
    };
    success?: {
      light?: string;
      dark?: string;
    };
    error?: {
      light?: string;
      dark?: string;
    };
    warning?: {
      light?: string;
      dark?: string;
    };
    primary?: {
      light?: string;
      dark?: string;
      DEFAULT?: string;
      foreground?: string;
    };
    secondary?: {
      light?: string;
      dark?: string;
      DEFAULT?: string;
      foreground?: string;
    };
    default?: {
      light?: string;
      dark?: string;
    };
    background?: string;
    foreground?: string;
    destructive?: {
      DEFAULT?: string;
      foreground?: string;
    };
    muted?: {
      DEFAULT?: string;
      foreground?: string;
    };
    accent?: {
      DEFAULT?: string;
      foreground?: string;
    };
    card?: {
      DEFAULT?: string;
      foreground?: string;
    };
    popover?: {
      DEFAULT?: string;
      foreground?: string;
    };
  };
  borderWidth?: {
    width?: string;
    '0'?: string;
    '2'?: string;
    '3'?: string;
    '4'?: string;
    '6'?: string;
    '8'?: string;
  };
  borderRadius?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
  };
  fontFamily?: {
    sans?: string[];
  };
};
