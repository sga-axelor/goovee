const themeOptions: any = {
  palette: {
    blue: '#0000FF',
    green: '#008000',
    purple: '#800080',
    red: '#FF0000',
    yellow: '#FFFF00',
    cyan: '#00FFFF',
    white: '#FFFFFF',
    black: '#000000',
    body_color: '#F0F0F0',
    emphasis_color: '#303030',
  },
  border: {
    color: '#e5e5e5',
    radius: '4px',
  },
  components: {
    Input: {
      color: '#e5e5e5',
      padding: '10px',
      focus: {
        shadow: '0 0 5px rgba(0, 0, 0, 0.5)',
        border_width: '2px',
      },
      invalid_focus: {
        shadow: '0 0 5px rgba(255, 0, 0, 0.5)',
        border_width: '2px',
      },
      placeholder: {
        color: '#888888',
      },
      invalid: {
        border_width: '1px',
      },
      border: {
        radius: '4px',
      },
      border_width: '1px',
    },
    Shell: {
      sidebar: {
        bg: '#202020',
      },
    },
    Panel: {
      header: {
        bg: '#404040',
        border: {
          width: '1px',
        },
      },
      title: {
        padding: '10px',
      },
    },
    Dropdown: {
      border: {
        color: '#CCCCCC',
      },
      item_hover: {
        bg: '#F0F0F0',
      },
      item_active: {
        bg: '#E0E0E0',
        color: '#000000',
      },
      divider: {
        bg: '#DDDDDD',
      },
    },
    NavMenu: {
      item: {
        border: {
          radius: '4px',
        },
      },
      item_hover: {
        bg: '#F0F0F0',
      },
      item_active: {
        bg: '#E0E0E0',
        color: '#000000',
      },
      icon: {
        bg: '#D0D0D0',
      },
      icon_hover: {
        bg: '#C0C0C0',
      },
      icon_active: {
        color: '#B0B0B0',
      },
    },
    NavTabs: {
      item: {
        padding: '10px',
      },
      text: {
        transform: 'uppercase',
      },
      icon: {
        bg: '#A0A0A0',
      },
      icon_hover: {
        bg: '#909090',
      },
      icon_active: {
        bg: '#808080',
      },
    },
    CommandBar: {
      button: {
        padding: '10px',
      },
      button_hover: {
        bg: '#707070',
      },
      button_active: {
        bg: '#606060',
      },
    },
    Table: {
      bg: '#FFFFFF',
      border: {
        color: '#CCCCCC',
      },
      header: {
        bg: '#F5F5F5',
      },
      row_odd: {
        bg: '#FAFAFA',
      },
      row_hover: {
        bg: '#F0F0F0',
      },
      row_active: {
        bg: '#E8E8E8',
      },
      cell_active: {
        bg: '#E0E0E0',
      },
      cell: {
        padding: '10px',
      },
    },
    Button: {
      paddingX: '15px',
      paddingY: '10px',
    },
    Badge: {
      padding: '5px',
      border: {
        radius: '50%',
      },
    },
    Form: {
      padding: '20px',
      gap: '15px',
    },
  },
  background: '#ffffff',
  foreground: '0 0% 3.92%',
  primary: {
    DEFAULT: '#212323',
    foreground: '#ffffff',
  },
  secondary: {
    DEFAULT: '#f5f5f5',
    foreground: '#212323',
  },
  destructive: {
    DEFAULT: '#ef4444',
    foreground: '#ffffff',
  },
  muted: {
    DEFAULT: '#f5f5f5',
    foreground: '#737373',
  },
  accent: {
    DEFAULT: '#f5f5f5',
    foreground: '#212323',
  },
  popover: {
    DEFAULT: '0 0% 100%',
    foreground: '#0a0a0a',
  },
  card: {
    DEFAULT: '#ffffff',
    foreground: '#0a0a0a',
  },
  typography: {
    body: {
      fontSize: '16px',
    },
  },
};
export default themeOptions;