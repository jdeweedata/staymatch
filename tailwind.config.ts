import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand Core */
        primary: {
          DEFAULT: "#FF3859",
          hover: "#E6324F",
          light: "#FF6B84",
          50: "#FFF1F3",
          100: "#FFE0E5",
          200: "#FFC6CF",
          500: "#FF3859",
          600: "#E6324F",
          700: "#CC2C46",
        },
        background: "#FFFFFF",
        foreground: "#272823",

        /* Surfaces */
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F7F7F7",
          tertiary: "#F0F0F0",
        },

        /* Text */
        text: {
          primary: "#272823",
          secondary: "#717171",
          tertiary: "#B0B0B0",
          inverse: "#FFFFFF",
        },

        /* Neutrals */
        muted: {
          DEFAULT: "#F7F7F7",
          foreground: "#717171",
        },
        border: "#E8E8E8",

        /* Cards */
        card: {
          DEFAULT: "#FFFFFF",
          hover: "#FAFAFA",
        },

        /* Semantic */
        accent: {
          success: "#00A699",
          warning: "#FFB400",
          error: "#C13515",
          info: "#428BFF",
        },

        /* Truth Score */
        truth: {
          excellent: "#00A699",
          good: "#008A05",
          average: "#FFB400",
          poor: "#C13515",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
        "card-hover": "0 8px 28px rgba(0, 0, 0, 0.10)",
        float: "0 16px 40px rgba(0, 0, 0, 0.12)",
        nav: "0 -1px 12px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "swipe-right": "swipe-right 0.3s ease-out forwards",
        "swipe-left": "swipe-left 0.3s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        "swipe-right": {
          "0%": { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateX(150%) rotate(20deg)",
            opacity: "0",
          },
        },
        "swipe-left": {
          "0%": { transform: "translateX(0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateX(-150%) rotate(-20deg)",
            opacity: "0",
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
