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
          50:  '#eef2f7',
          100: '#d8e0ec',
          200: '#b3c0d8',
          300: '#8597b8',
          400: '#5a7095',
          500: '#34507a',
          600: '#1f3a5e',
          700: '#1A3050',
          800: '#122237',
          900: '#0a1828',
        },
        ink:  '#1f1f1f',
        ink2: '#4a4a4a',
        mute: '#8a8a8a',
        rule: '#ececec',
        soft: '#fbfafa',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        card:      '0 1px 2px rgba(0,0,0,0.04), 0 4px 18px -8px rgba(0,0,0,0.08)',
        cardHover: '0 8px 30px -8px rgba(42,63,122,0.25)',
        float:     '0 6px 22px rgba(42,63,122,0.35)',
      },
      keyframes: {
        slideUp:    { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        floatPulse: {
          '0%, 100%': { boxShadow: '0 6px 22px rgba(26,48,80,0.35)' },
          '50%':      { boxShadow: '0 6px 28px rgba(244,48,98,0.45)' },
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
