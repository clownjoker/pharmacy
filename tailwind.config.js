/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9",   // sky-500
        secondary: "#10b981", // emerald-500
        background: "#E6F2FF",
      },
      fontFamily: {
        tajawal: ['Tajawal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
     require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}





// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           50: '#f0f9ff',
//           100: '#e0f2fe',
//           200: '#bae6fd',
//           300: '#7dd3fc',
//           400: '#38bdf8',
//           500: '#0ea5e9',
//           600: '#0284c7',
//           700: '#0369a1',
//           800: '#075985',
//           900: '#0c4a6e',
//         }
//       },
//       fontFamily: {
//         'arabic': ['IBM Plex Sans Arabic', 'sans-serif'],
//       },
//     },
//   },
//   plugins: [],
// }