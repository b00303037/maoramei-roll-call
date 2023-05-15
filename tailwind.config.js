/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        /**
         * 2014 Material Design color palettes
         */
        primary: {
          DEFAULT: "#3f51b5",
          100: "#c5cae9",
          200: "#9fa8da",
          300: "#7986cb",
          400: "#5c6bc0",
          500: "#3f51b5",
          600: "#3949ab",
          700: "#303f9f",
          800: "#283593",
          900: "#1a237e",
        },
        /**
         * http://mcg.mbitson.com
         */
        accent: {
          DEFAULT: "#ff4081",
          100: "#ffc6d9",
          200: "#ffa0c0",
          300: "#ff79a7",
          400: "#ff5d94",
          500: "#ff4081",
          600: "#ff3a79",
          700: "#ff326e",
          800: "#ff2a64",
          900: "#ff1c51",
        },
        /**
         * 2014 Material Design color palettes
         */
        warn: {
          DEFAULT: "#f44336",
          100: "#ffcdd2",
          200: "#ef9a9a",
          300: "#e57373",
          400: "#ef5350",
          500: "#f44336",
          600: "#e53935",
          700: "#d32f2f",
          800: "#c62828",
          900: "#b71c1c",
        },
      },
      height: {
        120: "30rem",
      },
    },
  },
  plugins: [],
};
