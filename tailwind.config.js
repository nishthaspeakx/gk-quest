/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Playful, kid-friendly type
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'], // headings, big buttons
        body: ['Fredoka', 'system-ui', 'sans-serif'], // everything else
      },
      // Bright-but-not-harsh palette (soft, saturated pastels + friendly primaries)
      colors: {
        brand: {
          purple: '#7c3aed',
          indigo: '#6366f1',
          blue: '#3b82f6',
          sky: '#38bdf8',
          teal: '#14b8a6',
          green: '#22c55e',
          lime: '#84cc16',
          yellow: '#facc15',
          orange: '#fb923c',
          coral: '#fb7185',
          pink: '#ec4899',
          // Soft background tints used as `bg-brand-mist` / `bg-brand-cream`
          // throughout (stat tiles, avatar chip, equip buttons). These must live
          // INSIDE `brand` or those classes resolve to nothing (transparent).
          cream: '#fff7ed',
          mist: '#f5f3ff',
        },
        // Also available as top-level `bg-cream` / `bg-mist`.
        cream: '#fff7ed',
        mist: '#f5f3ff',
      },
      // Generous, friendly rounding
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        blob: '2.5rem',
      },
      // Chunky, tactile shadows for big buttons and cards
      boxShadow: {
        pop: '0 6px 0 0 rgba(0,0,0,0.12)',
        'pop-lg': '0 10px 0 0 rgba(0,0,0,0.14)',
        card: '0 12px 30px -8px rgba(80, 40, 160, 0.25)',
        glow: '0 0 24px 0 rgba(124, 58, 237, 0.35)',
      },
      // Fun little animations for delight
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.5s ease-out',
        wiggle: 'wiggle 0.6s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
