import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "muted-foreground": "var(--muted-foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        border: "var(--border)",
        "bg-input": "var(--bg-input)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
        "bg-page": "var(--bg-page)",
      },
    },
  },
  plugins: [],
};

export default config;
