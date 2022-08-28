/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.tsx",
    "./components/**/*.tsx"
  ],
  theme: {
    extend: {
      keyframes: {
        roll: {
          "0%": {
            transform: "rotate(0deg)"
          },
          "100%": {
            transform: "rotate(720deg)"
          }
        }
      },
      animation: {
        "roll": "roll 600ms ease-in-out"
      }
    }
  },
  plugins: []
}
