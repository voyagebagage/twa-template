/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "app-background-primary": "#030d17",
        "app-accent-primary": "#0080FF",
        "app-accent-secondary": "#0063C4",
        blue: {
          50: "#EBF8FF",
          100: "#D6EFFF",
          200: "#A0D7FF",
          300: "#66BFFF",
          400: "#3BA7FF",
          500: "#0080FF", // Primary blue
          600: "#0063C4",
          700: "#004C99",
          800: "#003366",
          900: "#001A33",
        },
        telegram: "#0088cc",
      },
    },
  },
  plugins: [],
};
