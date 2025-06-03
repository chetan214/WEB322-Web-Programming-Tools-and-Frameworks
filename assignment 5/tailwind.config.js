/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.ejs`],
  daisyui: {
    themes: ['dark'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}

