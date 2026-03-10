/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
      colors: {
        trackgov: {
          navy: '#1E3A5F',
          gold: '#CA8A04',
          royal: '#1D4ED8',
          light: '#EFF6FF',
          background: '#F8FAFC',
          surface: '#FFFFFF',
          text: {
            primary: '#0F172A',
            muted: '#64748B',
          },
          success: '#15803D',
          warning: '#B45309',
          danger: '#B91C1C',
          border: '#E2E8F0',
        },
      },
    },
  },
  plugins: [],
}
