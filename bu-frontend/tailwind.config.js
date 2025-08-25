/** @type {import('tailwindcss').Config} */
export default {
  content: './src/**/*.{html,js,jsx,ts,tsx}',
  theme: {
    extend:{
      colors : {
        'red':'#C20E1A',
        'red-dark': '#841F1C',
        'gray-dark':'#636363',
        'gray':'#CFCFCF',
        'blue':'#3D5AA2',
        'white':'#f4f4f4'
        },
      fontFamily:{
        sans: ['Open Sans', 'Arial']
      },
  }
  },
  plugins: [],
}

