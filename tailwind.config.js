/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        blue: 'var(--palette-blue)',
        green: 'var(--palette-green)',
        purple: 'var(--palette-purple)',
        red: 'var(--palette-red)',
        yellow: 'var(--palette-yellow)',
        cyan: 'var(--palette-cyan)',
        white: 'var(--palette-white)',
        black: 'var(--palette-black)',
        body: 'var(--palette-body_color)',
        emphasis: 'var(--palette-emphasis_color)',
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: 'var(--border-color)',
        'dropdown-item-hover': 'var(--components-Dropdown-item_hover-bg)',
        'dropdown-item-active': 'var(--components-Dropdown-item_active-bg)',
        'dropdown-item-active-color': 'var(--components-Dropdown-item_active-color)',
        'navmenu-item-hover': 'var(--components-NavMenu-item_hover-bg)',
        'navmenu-item-active': 'var(--components-NavMenu-item_active-bg)',
        'commandbar-button-hover': 'var(--components-CommandBar-button_hover-bg)',
        'commandbar-button-active': 'var(--components-CommandBar-button_active-bg)',
        'table-row-odd': 'var(--components-Table-row_odd-bg)',
        'table-row-hover': 'var(--components-Table-row_hover-bg)',
        'table-row-active': 'var(--components-Table-row_active-bg)',
        'table-cell-active': 'var(--components-Table-cell_active-bg)',
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        main_purple: "hsl(var(--main_purple))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        content: {
          DEFAULT: "hsl(var(--content))",
          foreground: "hsl(var(--content-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      spacing: {
        'panel-title-padding-x': '0.5rem',
        'panel-title-padding-y': '0.25rem',
        'button-padding-x': 'var(--components-Button-paddingX)',
        'navtabs_item': 'var(--navtabs-item-padding)',
        'button-padding-y': 'var(--components-Button-paddingY)',
        'badge-padding-x': 'var(--components-Badge-padding-x)',
        'badge-padding-y': 'var(--components-Badge-padding-y)',
        'form-padding': 'var(--components-Form-padding)',
        'form-gap-x': 'var(--components-Form-gap-x)',
        'form-gap-y': 'var(--components-Form-gap-y)',
        'input-padding-y': 'var(--components-Input-padding-y)',
        'input-padding-bottom': 'var(--components-Input-padding-bottom)',
      },
      borderRadius: {
        'navmenu-item': 'var(--components-NavMenu-item-border-radius)',
        'badge': 'var(--components-Badge-border-radius)',
        'input': 'var(--components-Input-border-radius)',
      },
      borderWidth: {
        'input-focus': 'var(--components-Input-focus-border_width)',
        'input-invalid-focus': 'var(--components-Input-invalid_focus-border_width)',
        'input-invalid': 'var(--components-Input-invalid-border_width)',
      },
      fontSize: {
        'body': 'var(--typography-body-fontSize)',
      },
      placeholderColor: {
        input: 'var(--components-Input-placeholder-color)',
      },
      boxShadow: {
        'input-focus': 'none',
        'input-invalid-focus': 'none',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addUtilities }) {
      addUtilities({
        '.input-padding': {
          padding: 'var(--components-Input-padding)',
        },
        '.input-focus': {
          boxShadow: 'none',
          borderWidth: 'var(--components-Input-focus-border_width)',
        },
        '.input-invalid-focus': {
          boxShadow: 'none',
          borderWidth: 'var(--components-Input-invalid_focus-border_width)',
        },
        '.input-invalid': {
          borderWidth: 'var(--components-Input-invalid-border_width)',
        },
        '.input-placeholder': {
          '::placeholder': {
            color: 'var(--components-Input-placeholder-color)',
          },
        },
        '.button-padding': {
          padding: 'var(--components-Button-paddingY) var(--components-Button-paddingX)',
        },
        '.badge-padding': {
          padding: 'var(--components-Badge-padding)',
        },
        '.form-padding': {
          padding: 'var(--components-Form-padding)',
        },
        '.form-gap-x': {
          columnGap: 'var(--components-Form-gap-x)',
        },
        '.form-gap-y': {
          rowGap: 'var(--components-Form-gap-y)',
        },
      });
    }
  ],
}