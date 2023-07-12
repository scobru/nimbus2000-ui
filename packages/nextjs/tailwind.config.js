/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "scaffoldEthDark",
  // DaisyUI theme colors
  daisyui: {
    themes: [{
      light: {
        "primary": "#ffffff",
        "secondary": "#f6f6f8",
        "accent": "#007aff",
        "neutral": "#8e8e93",
        "base-100": "#f4f4f7",
        "info": "#0a84ff",
        "success": "#30d158",
        "warning": "#ff9f0a",
        "error": "#ff453a",
      },
      dark: {
        "primary": "#121212",
        "secondary": "#1e1e1e",
        "accent": "#0c66ff",
        "neutral": "#646464",
        "base-100": "#282828",
        "info": "#0c8dff",
        "success": "#2fdd31",
        "warning": "#ff7f0b",
        "error": "#ff3a2f",
      },
    }, ]

  },

  theme: {
    // Extend Tailwind classes (e.g. font-bai-jamjuree, animate-grow)
    extend: {
      fontFamily: {
        "bai-jamjuree": ["Bai Jamjuree", "sans-serif"],
      },
      keyframes: {
        grow: {
          "0%": {
            width: "0%",
          },
          "100%": {
            width: "100%",
          },
        },
        zoom: {
          "0%, 100%": {
            transform: "scale(1, 1)"
          },
          "50%": {
            transform: "scale(1.1, 1.1)"
          },
        },
      },
      animation: {
        grow: "grow 5s linear infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        zoom: "zoom 1s ease infinite",
      },
    },
  },
};