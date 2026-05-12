import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#3D7E8A",
        accentSoft: "#E6F1F2",
        accentStrong: "#2F6974",
        ink: "#1D2B2E",
        muted: "#66777A",
        paper: "#F4F7F7",
        screen: "#EEF4F4",
        surface: "#FFFFFF",
        surfaceSoft: "#F8FBFA",
        line: "#D8E2E2",
        teal: "#3D7E8A",
        moss: "#3F8F64",
        success: "#3F8F64",
        successSoft: "#EAF5EF",
        warning: "#B9852D",
        warningSoft: "#FFF3DC",
        risk: "#C96A5A",
        riskSoft: "#FCEDEA",
        clay: "#C96A5A",
        disabled: "#B8C5C6",
      },
      fontFamily: {
        sans: [
          "Paperlogy",
          "Apple SD Gothic Neo",
          "Malgun Gothic",
          "Segoe UI",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 16px 40px rgba(64, 97, 104, 0.09)",
      },
    },
  },
  plugins: [],
};

export default config;
