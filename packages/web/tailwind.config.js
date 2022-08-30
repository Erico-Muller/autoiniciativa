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
        },
        emerge: {
          "0%": {
            transform: "translate(-50%, -30%)",
            opacity: 0
          },
          "100%": {
            transform: "translate(-50%, -50%)",
            opacity: 100
          }          
        }
      },
      animation: {
        "roll": "roll 600ms ease-in-out",
        "emerge": "emerge 300ms ease-in-out"
      }
    }
  },
  plugins: []
}
