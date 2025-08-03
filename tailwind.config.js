/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f8',
          100: '#fde6f1',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          900: '#831843',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          900: '#164e63',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}