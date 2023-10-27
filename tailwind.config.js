/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      backgroundColor: {
        'google-mar': '#9CC0F9',
      },
    },
  },
  plugins: [],
  variants: {
    extend: {
      display: ['print'],
    },
  },
}

