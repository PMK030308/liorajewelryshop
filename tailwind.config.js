/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff8fa',
          100: '#fdeef3',
          200: '#f8d8e3',
          300: '#efb8ca',
          400: '#df8fa9',
          500: '#c96b8d',  /* pastel rose matched to LIORA logo */
          600: '#ad4f74',
          700: '#8f3f61',
          800: '#71334f',
          900: '#5d2c43',
        },
        ink:  '#2a2025',
        ink2: '#5d5157',
        mute: '#9a8b92',
        rule: '#f1dfe6',
        soft: '#fff8fa',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        card:      '0 1px 2px rgba(0,0,0,0.04), 0 4px 18px -8px rgba(0,0,0,0.08)',
        cardHover: '0 8px 30px -8px rgba(201,107,141,0.26)',
        float:     '0 6px 22px rgba(201,107,141,0.28)',
      },
      keyframes: {
        slideUp:    { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        floatPulse: {
          '0%, 100%': { boxShadow: '0 6px 22px rgba(201,107,141,0.28)' },
          '50%':      { boxShadow: '0 6px 28px rgba(239,184,202,0.5)' },
        },
        cartBounce: {
          '0%':   { transform: 'scale(1) rotate(0)' },
          '20%':  { transform: 'scale(1.18) rotate(-10deg)' },
          '40%':  { transform: 'scale(0.95) rotate(8deg)' },
          '60%':  { transform: 'scale(1.08) rotate(-4deg)' },
          '80%':  { transform: 'scale(0.98) rotate(2deg)' },
          '100%': { transform: 'scale(1) rotate(0)' },
        },
        badgePop: {
          '0%':   { transform: 'scale(1)' },
          '40%':  { transform: 'scale(1.5)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        slideUp:    'slideUp 0.6s cubic-bezier(.2,.6,.2,1) both',
        fadeUp:     'fadeUp 0.4s ease',
        floatPulse: 'floatPulse 2.4s ease-in-out infinite',
        cartBounce: 'cartBounce 0.6s cubic-bezier(.36,.07,.19,.97) both',
        badgePop:   'badgePop 0.45s cubic-bezier(.36,.07,.19,.97) both',
      },
    },
  },
  plugins: [],
}
