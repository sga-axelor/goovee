type Theme = {
    palette: {
      blue: string;
      green: string;
      purple: string;
      red: string;
      yellow: string;
      cyan: string;
      white: string;
      black: string;
      body_color: string;
      emphasis_color: string;
    };
    border: {
      color: string;
    };
    typography: {
      body: {
        fontSize: string;
      };
    };
    components: {
      Shell: {
        sidebar: {
          bg: string;
        };
      };
      Panel: {
        header: {
          bg: string;
          border: {
            width: number;
          };
        };
        title: {
          padding: string;
        };
      };
      Dropdown: {
        border: {
          color: string;
        };
        item_hover: {
          bg: string;
        };
        item_active: {
          bg: string;
          color: string;
        };
        divider: {
          bg: string;
        };
      };
      NavMenu: {
        item: {
          border: {
            radius: string;
          };
        };
        item_hover: {
          bg: string;
        };
        item_active: {
          bg: string;
          color: string;
        };
        icon: {
          bg: string;
        };
        icon_hover: {
          bg: string;
        };
        icon_active: {
          color: string;
        };
      };
      NavTabs: {
        item: {
          padding: string;
        };
        text: {
          transform: string;
        };
        icon: {
          bg: string;
        };
        icon_hover: {
          bg: string;
        };
        icon_active: {
          bg: string;
        };
      };
      CommandBar: {
        button: {
          padding: string;
        };
        button_hover: {
          bg: string;
        };
        button_active: {
          bg: string;
        };
      };
      Table: {
        bg: string;
        border: {
          color: string;
        };
        header: {
          bg: string;
        };
        row_odd: {
          bg: string;
        };
        row_hover: {
          bg: string;
        };
        row_active: {
          bg: string;
        };
        cell_active: {
          bg: string;
        };
        cell: {
          padding: string;
        };
      };
      Button: {
        paddingX: string;
        paddingY: string;
      };
      Badge: {
        padding: string;
        border: {
          radius: string;
        };
      };
      Form: {
        padding: string;
        gap: string;
      };
      Input: {
        padding: string;
        focus: {
          shadow: string;
          border_width: string;
        };
        invalid_focus: {
          shadow: string;
          border_width: string;
        };
        placeholder: {
          color: string;
        };
        invalid: {
          border_width: string;
        };
        border: {
          radius: number;
        };
        border_width: string;
      };
    };
  };
  
const generateCssVar = (css:Theme) =>{
    const dynamicCss = `
    :root {
    --palette-blue: ${css?.palette?.blue};
    --palette-green: ${css?.palette?.green};
    --palette-purple: ${css?.palette?.purple};
    --palette-red: ${css?.palette?.red};
    --palette-yellow: ${css?.palette?.yellow};
    --palette-cyan: ${css?.palette?.cyan};
    --palette-white: ${css?.palette?.white};
    --palette-black: ${css?.palette?.black};
    --palette-body_color: ${css?.palette?.body_color};
    --palette-emphasis_color: ${css?.palette?.emphasis_color};
    --border-color: ${css?.border?.color};
    --typography-body-fontSize: ${css?.typography?.body?.fontSize};
    --components-Shell-sidebar-bg: ${css?.components?.Shell?.sidebar?.bg};
    --components-Panel-header-bg: ${css?.components?.Panel?.header?.bg};
    --components-Panel-header-border-width: ${css?.components?.Panel?.header?.border?.width};
    --components-Panel-title-padding: ${css?.components?.Panel?.title?.padding};
    --components-Dropdown-border-color: ${css?.components?.Dropdown?.border?.color};
    --components-Dropdown-item_hover-bg: ${css?.components?.Dropdown?.item_hover?.bg};
    --components-Dropdown-item_active-bg: ${css?.components?.Dropdown?.item_active?.bg};
    --components-Dropdown-item_active-color: ${css?.components?.Dropdown?.item_active?.color};
    --components-Dropdown-divider-bg: ${css?.components?.Dropdown?.divider?.bg};
    --components-NavMenu-item-border-radius: ${css?.components?.NavMenu?.item?.border?.radius};
    --components-NavMenu-item_hover-bg: ${css?.components?.NavMenu?.item_hover?.bg};
    --components-NavMenu-item_active-bg: ${css?.components?.NavMenu?.item_active?.bg};
    --components-NavMenu-item_active-color: ${css?.components?.NavMenu?.item_active?.color};
    --components-NavMenu-icon-bg: ${css?.components?.NavMenu?.icon?.bg};
    --components-NavMenu-icon_hover-bg: ${css?.components?.NavMenu?.icon_hover?.bg};
    --components-NavMenu-icon_active-color: ${css?.components?.NavMenu?.icon_active?.color};
    --components-NavTabs-item-padding: ${css?.components?.NavTabs?.item?.padding};
    --components-NavTabs-text-transform: ${css?.components?.NavTabs?.text?.transform};
    --components-NavTabs-icon-bg: ${css?.components?.NavTabs?.icon?.bg};
    --components-NavTabs-icon_hover-bg: ${css?.components?.NavTabs?.icon_hover?.bg};
    --components-NavTabs-icon_active-bg: ${css?.components?.NavTabs?.icon_active?.bg};
    --components-CommandBar-button-padding: ${css?.components?.CommandBar?.button?.padding};
    --components-CommandBar-button_hover-bg: ${css?.components?.CommandBar?.button_hover?.bg};
    --components-CommandBar-button_active-bg: ${css?.components?.CommandBar?.button_active?.bg};
    --components-Table-bg: ${css?.components?.Table?.bg};
    --components-Table-border-color: ${css?.components?.Table?.border?.color};
    --components-Table-header-bg: ${css?.components?.Table?.header?.bg};
    --components-Table-row_odd-bg: ${css?.components?.Table?.row_odd?.bg};
    --components-Table-row_hover-bg: ${css?.components?.Table?.row_hover?.bg};
    --components-Table-row_active-bg: ${css?.components?.Table?.row_active?.bg};
    --components-Table-cell_active-bg: ${css?.components?.Table?.cell_active?.bg};
    --components-Table-cell-padding: ${css?.components?.Table?.cell?.padding};
    --components-Button-paddingX: ${css?.components?.Button?.paddingX};
    --components-Button-paddingY: ${css?.components?.Button?.paddingY};
    --components-Badge-padding: ${css?.components?.Badge?.padding};
    --components-Badge-border-radius: ${css?.components?.Badge?.border?.radius};
    --components-Form-padding: ${css?.components?.Form?.padding};
    --components-Form-gap: ${css?.components?.Form?.gap};
    --components-Input-padding: ${css?.components?.Input?.padding};
    --components-Input-focus-shadow: ${css?.components?.Input?.focus?.shadow};
    --components-Input-focus-border_width: ${css?.components?.Input?.focus?.border_width};
    --components-Input-invalid_focus-shadow: ${css?.components?.Input?.invalid_focus?.shadow};
    --components-Input-invalid_focus-border_width: ${css?.components?.Input?.invalid_focus?.border_width};
    --components-Input-placeholder-color: ${css?.components?.Input?.placeholder?.color};
    --components-Input-invalid-border_width: ${css?.components?.Input?.invalid?.border_width};
    --components-Input-border-radius: ${css?.components?.Input?.border?.radius};
    --components-Input-border_width: ${css?.components?.Input?.border_width};
    }
    `;
    return dynamicCss
}
export default generateCssVar;