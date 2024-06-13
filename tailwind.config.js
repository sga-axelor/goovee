const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
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
        border: "var(--border)",
        input: "var(--input-color)",
        ring: "var(--ring)",
        body: {
          light : "var(--body-light)",
        },
        main: {
          purple: "var(--main-purple)",
        },
        detail: {
          blue: "var(--detail-blue)",
        },
        link: {
          blue: "var(--link-blue)",
        },
        success: {
          light: 'var(--success-light)',
          dark: 'var(--success-dark)',
        },
        error: {
          light: 'var(--error-light)',
          dark: 'var(--error-dark)',
        },
        warning: {
          light: 'var(--warning-light)',
          dark: 'var(--warning-dark)',
        },
        primary: {
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        secondary: {
          light: 'var(--secondary-light)',
          dark: 'var(--secondary-dark)',
        },
        default: {
          light: 'var(--default-light)',
          dark: 'var(--default-dark)',
        },
        background: "var(--background)",
        foreground: "hsl(var(--foreground))", //we should hsl value here
        primary: {
          DEFAULT: "var(--primary-default)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary-default)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive-default)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted-default)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent-default)",
          foreground: "var(--accent-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",//we should hsl value here
          foreground: "var(--popover-foreground)",
        },
      },
      borderWidth: { 
        width: 'var(--width)',
        '0': '0',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      borderRadius: {
        sm: `calc(var(--radius) - 2px)`,
        md: `calc(var(--radius) - -2px)`,
        lg: `calc(var(--radius) - -4px)`,
        xl: `calc(var(--radius) - -8px)`,
        '2xl': `calc(var(--radius) - -12px)`,
        '3xl': `calc(var(--radius) - -20px)`,
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
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
  plugins: [require("tailwindcss-animate")],
}
