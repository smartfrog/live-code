module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Instrument Sans", "sans-serif"],
      },
      colors: {
        ink: "#0f172a",
        slate: "#334155",
        mist: "#e2e8f0",
        cloud: "#f8fafc",
        accent: "#f97316",
        accentDark: "#ea580c",
      },
      boxShadow: {
        soft: "0 20px 45px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
