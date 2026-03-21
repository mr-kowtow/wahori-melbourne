/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        jp: ['Noto Sans JP', 'sans-serif'],
      },
      colors: {
        line:       '#06C755',
        'line-dk':  '#05a648',
        navy:       '#0D1B2A',
        'navy-md':  '#1B3A5C',
      },
    },
  },
  safelist: [
    // Classes set dynamically via JavaScript
    'bg-line', 'text-white', 'text-white/60', 'text-gray-400', 'text-gray-500',
    'border-white/30', 'border-gray-200',
    'hover:bg-white/10', 'hover:bg-gray-50',
    'bg-white/95', 'backdrop-blur', 'shadow-sm',
  ],
}
