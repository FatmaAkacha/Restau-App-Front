/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red:     '#E8192C',
          redDark: '#C0111F',
          black:   '#1A1A1A',
          card:    '#FFFFFF',
          bg:      '#F7F7F7',
          border:  '#E5E5E5',
          muted:   '#888888',
          dark:    '#1A1A1A',
          light:   '#FFF5F5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'red-glow': '0 4px 20px rgba(232,25,44,0.25)',
        'red-sm':   '0 2px 8px rgba(232,25,44,0.15)',
        'card':     '0 2px 12px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'red-gradient': 'linear-gradient(135deg, #E8192C 0%, #A50E1C 100%)',
      }
    }
  },
  plugins: []
}
