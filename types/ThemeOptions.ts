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
  borderWidth: string;
  borderRadius: string;
  fontFamily?: string;
};
