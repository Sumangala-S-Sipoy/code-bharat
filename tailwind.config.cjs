module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5fbff',
          100: '#eaf6ff',
          200: '#c7e9ff',
          500: '#0ea5a4',
        },
      },
    },
  },
  plugins: [],
}
