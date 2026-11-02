import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          darkest: '#1A110D',
          dark: '#2B1D16',
          mid: '#3A2A21',
          light: '#4E3A2F',
          surface: '#34251D',
          sand: '#D9A87C',
          caramel: '#E2B58D',
          muted: '#A88B74',
          subtle: '#8C6F5A',
          cream: '#F4ECE4',
        },
        teal: {
          accent: '#6FA8A3',
          hover: '#5E9691',
          light: '#88BCB7',
          darkText: '#182725',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Akbalthom', 'sans-serif'],
        khmer: ['Akbalthom', 'sans-serif'],
        'khmer-heading': ['Akbalthom-HighSchool', 'Akbalthom', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 25px rgba(111, 168, 163, 0.35)',
        cup: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-reverse': 'floatReverse 7s ease-in-out infinite',
        pulseGlow: 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(2deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-18px) rotate(-3deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(2.5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

