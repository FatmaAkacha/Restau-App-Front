/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:     '#E8192C',
          redDark: '#C0111F',
          redGlow: '#FF3347',
          black:   '#0A0A0A',
          dark:    '#141414',
          card:    '#1C1C1C',
          border:  '#2A2A2A',
          muted:   '#6B6B6B',
          light:   '#F5F5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'red-glow': '0 0 30px rgba(232, 25, 44, 0.35)',
        'red-sm':   '0 0 12px rgba(232, 25, 44, 0.2)',
        'card':     '0 4px 24px rgba(0,0,0,0.4)',
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #E8192C 0%, #8B0000 100%)',
        'dark-gradient':'linear-gradient(180deg, #1C1C1C 0%, #0A0A0A 100%)',
      }
    }
  },
  plugins: []
}
