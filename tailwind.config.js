const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1a365d",
          50: "#f0f4f8",
          100: "#d9e2ed",
          200: "#b3c5db",
          300: "#8da8c9",
          400: "#668bb7",
          500: "#406ea5",
          600: "#335784",
          700: "#264063",
          800: "#1a2942",
          900: "#0d1321"
        },
        secondary: {
          DEFAULT: "#2d3748",
          50: "#f7f8f9",
          100: "#edf0f3",
          200: "#dbe0e7",
          300: "#c9d0db",
          400: "#b7c0cf",
          500: "#a5b0c3",
          600: "#939fb7",
          700: "#818fab",
          800: "#6f7f9f",
          900: "#5d6f93"
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827"
        }
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}; 