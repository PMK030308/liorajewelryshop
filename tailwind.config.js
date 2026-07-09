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
          50:  '#fff7f9',
          100: '#ffe9f1',
          200: '#ffcfdd',
          300: '#ffb0c7',
          400: '#ff8daa',
          500: '#f472a0',  /* pastel pink — primary accent, hợp logo & sản phẩm */
          600: '#e1588e',
          650: '#d04f82',
          700: '#b23a68',  /* rose for buttons/footer (đủ tương phản với chữ trắng) */
          800: '#923055',
          850: '#7a2a47',
          900: '#64243c',
        },
        ink:  '#2a2025',
        ink2: '#5d5157',
        mute: '#9a8b92',
        rule: '#f7d5e1',
        soft: '#fff7f9',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        card:      '0 1px 2px rgba(0,0,0,0.04), 0 4px 18px -8px rgba(0,0,0,0.08)',
        cardHover: '0 8px 30px -8px rgba(244,114,160,0.22)',
        float:     '0 6px 22px rgba(244,114,160,0.24)',
      },
      keyframes: {
        slideUp:    { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        floatPulse: {
          '0%, 100%': { boxShadow: '0 6px 22px rgba(244,114,160,0.28)' },
          '50%':      { boxShadow: '0 6px 28px rgba(255,176,199,0.5)' },
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