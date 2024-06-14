const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "ui/components/**/*.{ts,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        body: {
          light : "hsl(var(--body-light))",
        },
        main: {
          purple: "hsl(var(--main-purple))",
        },
        detail: {
          blue: "hsl(var(--detail-blue))",
        },
        link: {
          blue: "hsl(var(--link-blue))",
        },
        success: {
          light: 'hsl(var(--success-light))',
          dark: 'hsl(var(--success-dark))',
        },
        error: {
          light: 'hsl(var(--error-light))',
          dark: 'hsl(var(--error-dark))',
        },
        warning: {
          light: 'hsl(var(--warning-light))',
          dark: 'hsl(var(--warning-dark))',
        },
        default: {
          light: 'hsl(var(--default-light))',
          dark: 'hsl(var(--default-dark))',
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))", //we should hsl value here
        primary: {
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))',
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          light: 'hsl(var(--secondary-light))',
          dark: 'hsl(var(--secondary-dark))',
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
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",//we should hsl value here
          foreground: "hsl(var(--popover-foreground))",
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
