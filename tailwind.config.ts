import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta Estrictamente Monocromática "obsessed.cba"
        background: "#FFFFFF",
        foreground: "#000000",
        brand: {
          white: "#FFFFFF",
          black: "#000000",
          muted: "#737373",      // Texto secundario / sutil
          border: "#E5E7EB",     // Bordes finos geométricos
          surface: "#FAFAFA",    // Fondos tenues para inputs/tablas
          darkMuted: "#171717",  // Variaciones de alto contraste
        },
      },
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      letterSpacing: {
        widest: "0.2em",
        ultra: "0.3em",
      },
      borderWidth: {
        hairline: "0.5px",
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        none: "none",
      },
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "4px",
      },
    },
  },
  plugins: [],
};

export default config;
