/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium Enterprise Sky Blue Theme with Deep Navy Contrast
        corp: {
          bg: '#EBF5FE',
          alt: '#FFFFFF',
          sky: '#E0F2FE',
          accent: '#BAE6FD',
          primary: '#0284C7',
          primaryHover: '#0369A1',
          navy: '#092342',
          heading: '#092342',
          body: '#2D425A',
          border: '#BAE6FD',
          muted: '#536B85',
          card: '#FFFFFF',
        },
        navy: {
          DEFAULT: '#092342',
          mid: '#13355C',
          light: '#0284C7',
          border: '#BAE6FD',
        },
        electric: {
          DEFAULT: '#0284C7',
          hover: '#0369A1',
          light: '#E0F2FE',
        },
        cyanAccent: {
          DEFAULT: '#0284C7',
          light: '#EBF5FE',
        },
        offwhite: '#FFFFFF',
        cardWhite: '#FFFFFF',
        textMain: '#092342',
        textSec: '#2D425A',
        textMuted: '#536B85',
        borderSoft: '#BAE6FD',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #071A2B 0%, #0B2942 50%, #123B5D 100%)',
        'hero-accent': 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }
    },
  },
  plugins: [],
}

