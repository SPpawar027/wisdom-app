// tailwind.config.js

module.exports = {
  content: ["./App.{js,ts,tsx}", "./src/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        background: "#0F172A",
        card: "#1E293B",
      },
    },
  },
  plugins: [],
};