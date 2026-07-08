/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F3F0E6',
          50: '#FCFAF5',
          100: '#F9F6ED',
        },
        ink: {
          DEFAULT: '#1D2B3A',
          70: '#4C5A68',
          40: '#8A94A0',
        },
        marigold: {
          DEFAULT: '#E0A526',
          deep: '#B8830F',
          tint: '#FBEBC9',
        },
        sprout: {
          DEFAULT: '#3F8F5F',
          tint: '#DCEDE1',
        },
        redline: {
          DEFAULT: '#C4472F',
        },
        stone: {
          DEFAULT: '#A79C87',
          line: '#E1DAC8',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      fontSize: {
        'display-hero': ['52px', { lineHeight: '1.1', fontWeight: '600', fontFamily: 'Fraunces, serif' }],
        'display-heading': ['28px', { lineHeight: '1.2', fontWeight: '600', fontFamily: 'Fraunces, serif' }],
        'body-large': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'phonetic': ['13px', { lineHeight: '1.4', fontWeight: '400', fontFamily: 'IBM Plex Mono, monospace' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
      },
      borderRadius: {
        'sm': '10px',
        'md': '16px',
        'lg': '22px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'bubble-in': 'bubble-in 0.18s ease-out',
        'streak-count': 'streak-count 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'bubble-in': {
          '0%': { opacity: '0', transform: 'translateY(4px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'streak-count': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
