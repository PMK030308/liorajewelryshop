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
          50:  '#FFF7FA',  /* section background — trắng pha hồng rất nhạt */
          100: '#FCEAF1',  /* tint nền hồng rất nhạt cho menu/subtle */
          200: '#F2DCE5',  /* border pastel */
          300: '#EBC8D9',  /* light accent */
          400: '#E6A8BF',  /* PRIMARY — hồng pastel accent */
          500: '#E6A8BF',  /* alias primary */
          600: '#D98CA8',  /* HOVER — hồng pastel đậm hơn */
          700: '#C57A94',  /* active/strong accent */
          800: '#A85F7C',  /* deep rose (dùng tiết kiệm) */
          850: '#8A4F66',
          900: '#6E3F52',
        },
        ink:  '#4A3C40',   /* text chính — nâu/xám đậm sang trọng */
        ink2: '#8A7C82',   /* text phụ */
        mute: '#A89AA0',   /* text muted */
        rule: '#F2DCE5',   /* border pastel */
        soft: '#FFF7FA',   /* section bg nhạt */
        bg:   '#FFFDFD',   /* background chủ đạo — trắng pha hồng cực nhạt */
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        script: ['"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        card:      '0 1px 2px rgba(74,60,64,0.04), 0 4px 18px -10px rgba(74,60,64,0.08)',
        cardHover: '0 8px 30px -10px rgba(198,122,148,0.18)',
        float:     '0 6px 22px rgba(198,122,148,0.16)',
      },
      keyframes: {
        slideUp:    { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUp:     { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        floatPulse: {
          '0%, 100%': { boxShadow: '0 6px 22px rgba(230,168,191,0.20)' },
          '50%':      { boxShadow: '0 6px 28px rgba(217,140,168,0.30)' },
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