import type { Config } from "tailwindcss"

const config = {
  darkMode: "class", // Use class strategy for dark mode
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}', // Keep old path just in case
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}', // Ensure src directory is scanned
	],
  prefix: "",
  theme: {
    // Basic theme structure needed for shadcn variables/plugins
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Shadcn adds colors, radius, keyframes, animation here via CSS vars
      // We keep extend empty as globals.css defines the vars
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
  // Need this plugin for shadcn component animations
  plugins: [require("tailwindcss-animate")], 
} satisfies Config

export default config
