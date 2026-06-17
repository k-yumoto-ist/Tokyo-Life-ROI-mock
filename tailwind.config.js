/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Noto Sans JP", "system-ui", "sans-serif"]
      },
      colors: {
        ink: "#101820",
        night: "#15243a",
        aqua: "#00a8c8",
        signal: "#ffd166",
        positive: "#18a058"
      },
      boxShadow: {
        glow: "0 24px 80px rgba(0, 168, 200, 0.18)"
      }
    }
  },
  plugins: []
};
