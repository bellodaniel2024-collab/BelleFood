import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      colors: {
        // Belle Food brand palette
        cream: {
          50: "#fffef7",
          100: "#fefcec",
          200: "#fdf5c4",
          300: "#fce99a",
          400: "#f9d84a",
          DEFAULT: "#fdf5c4",
        },
        tomato: {
          50: "#fff1f0",
          100: "#ffe1de",
          200: "#ffc7c2",
          300: "#ff9d97",
          400: "#ff6b63",
          500: "#f03d35",
          600: "#de2018",
          DEFAULT: "#c41c14",
          700: "#c41c14",
          800: "#a21813",
          900: "#861a14",
        },
        orange: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea6c0a",
          DEFAULT: "#ea6c0a",
          700: "#c2540a",
          800: "#9a3d0e",
          900: "#7c340f",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          DEFAULT: "#d97706",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        sage: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          DEFAULT: "#16a34a",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        charcoal: {
          50: "#f6f7f7",
          100: "#e1e4e4",
          200: "#c5cbcb",
          300: "#9ea9a9",
          400: "#778484",
          500: "#5c6b6b",
          600: "#4f5c5c",
          DEFAULT: "#2d3333",
          700: "#2d3333",
          800: "#232929",
          900: "#1c2020",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-right": "slideInRight 0.4s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
    },
  },
  plugins: [],
};

export default config;
