import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: "#f0fbfb",
          100: "#dcf6f5",
          200: "#b9edeb",
          500: "#0E7C7B",
          600: "#0b6867",
          700: "#095453",
          800: "#074140",
          900: "#063635",
        },
        terracotta: {
          50: "#fff6f4",
          100: "#ffede7",
          200: "#ffdcd0",
          500: "#E4572E",
          600: "#ca461f",
          700: "#a93615",
          800: "#892d13",
        },
        travel: {
          light: "#FFFFFF",
          muted: "#F7F7F4",
          border: "#E7E7E2",
          text: "#1D232A",
          subtext: "#636B74",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        brand: ["var(--font-montserrat)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "card-hover": "0 10px 25px rgba(0, 0, 0, 0.07), 0 4px 10px rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
};
export default config;
