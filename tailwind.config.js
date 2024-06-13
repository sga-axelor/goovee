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
        border: "var(--border-color)",
        input: "var(--input-color)",
        ring: "var(--ring)",
        main_purple: "var(--main_purple)",
        detail_blue: "var(--detail-blue)",
        link_blue: "var(--link-blue)",
        background: "var(--background)",
        foreground: "hsl(var(--foreground))", //we should hsl value here
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
        popover: {
          DEFAULT: "hsl(var(--popover))",//we should hsl value here
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },
      borderRadius: {
        lg: `var(--border-radius)`,
        md: `calc(var(--border-radius) - 2px)`,
        sm: "calc(var(--border-radius) - 4px)",
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
