import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050508",
        panel: "#0c0d13",
        cyan: "#21f6ff",
        violet: "#8d5cff",
        ember: "#ff6a2a",
        verified: "#41ff8b",
        failed: "#ff3d57"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        heading: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
        body: ["var(--font-body)"],
        accent: ["var(--font-accent)"],
        bebas: ["var(--font-display)"],
        syne: ["var(--font-display)"],
        figtree: ["var(--font-body)"]
      },
      boxShadow: {
        cyan: "0 0 32px rgba(33, 246, 255, 0.28)",
        violet: "0 0 36px rgba(141, 92, 255, 0.24)",
        ember: "0 0 28px rgba(255, 106, 42, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
