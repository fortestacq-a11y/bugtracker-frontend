/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Claude Design System Palette (from claude/tokens.css)
        parchment: {
          DEFAULT: '#f5f4ed', // Page canvas
          dark: '#edeae0',
        },
        ivory: {
          DEFAULT: '#faf9f5', // Elevated cards & containers
        },
        sand: {
          DEFAULT: '#e8e6dc', // Interactive surface / secondary buttons
          hover: '#dfdcce',
          border: '#e2dfd2',
        },
        terracotta: {
          DEFAULT: '#c96442', // Signature brand accent & primary CTA
          hover: '#b85737',
          active: '#a84c2e',
          light: '#f7ebe6',
          border: '#e8beaf',
        },
        coral: {
          DEFAULT: '#d97757',
        },
        anthropic: {
          black: '#141413',   // Primary text & dark surface
          warm: '#3d3d3a',    // Emphasized secondary text
          olive: '#5e5d59',   // Body text / muted
          stone: '#87867f',   // Metadata, footnotes, labels
        },
        crimson: {
          DEFAULT: '#b53333',
          light: '#fdf2f2',
          border: '#f5c6cb',
        },
        focusBlue: '#3898ec',
      },
      fontFamily: {
        serif: ['"Newsreader"', '"Lora"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['"Inter"', '"Anthropic Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Anthropic Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'claude-ring': '0 0 0 1px #e8e6dc',
        'claude-ring-hover': '0 0 0 1px #d1cfc5',
        'claude-lift': 'rgba(0, 0, 0, 0.04) 0px 4px 20px',
        'claude-lift-sm': 'rgba(0, 0, 0, 0.03) 0px 2px 8px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      }
    },
  },
  plugins: [],
}
