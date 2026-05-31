import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          midnight: '#0D0D0D',
          charcoal: '#1A1A1A',
          graphite: '#2D2D2D',
          ivory: '#FAFAF8',
          pearl: '#E8E4DE',
          // amber: '#C9A962',
          amber: '#FCD95B',
          whiskey: '#B8956E',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      maxWidth: {
        luxury: '1400px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      transitionDuration: {
        '600': '600ms',
        '800': '800ms',
      },
      letterSpacing: {
        'luxury': '0.2em',
        'widest2': '0.3em',
      },
    },
  },
  plugins: [],
}

export default config
