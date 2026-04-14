/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0f0f0f',
        primary: '#e10600', // F1 Red
        accent: '#00d2be',  // Mercedes Teal / Performance accent
        muted: '#2a2a2a',
        'text-main': '#e0e0e0',
        'text-dim': '#a0a0a0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'carbon-fiber': "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
      }
    },
  },
  plugins: [],
}
