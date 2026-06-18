import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        guhr: {
          background: "#F8F7F3",
          surface: "#FFFFFF",
          text: "#1F2933",
          muted: "#6B7280",
          gold: "#C8A95A",
          goldSoft: "#EFE6CF",
          border: "#E7E2D6",
          green: "#6F8F7A",
          orange: "#BD8658",
          red: "#B96D68",
          gray: "#8B918D"
        }
      },
      boxShadow: {
        soft: "0 14px 40px rgba(31, 41, 51, 0.08)",
        card: "0 8px 26px rgba(31, 41, 51, 0.07)"
      }
    }
  },
  plugins: []
};

export default config;
