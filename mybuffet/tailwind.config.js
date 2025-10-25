export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          50: '#ffffff',
          500: '#0039A6',
          600: '#D72B1F',
        }
      }
    }
  },
  plugins: [],
}
