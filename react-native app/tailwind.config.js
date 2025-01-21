/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        pthin: ["Poppins-Thin", "sans-serif"],
        pextralight: ["Poppins-ExtraLight", "sans-serif"],
        plight: ["Poppins-Light", "sans-serif"],
        pregular: ["Poppins-Regular", "sans-serif"],
        pmedium: ["Poppins-Medium", "sans-serif"],
        psemibold: ["Poppins-SemiBold", "sans-serif"],
        pbold: ["Poppins-Bold", "sans-serif"],
        pextrabold: ["Poppins-ExtraBold", "sans-serif"],
        pblack: ["Poppins-Black", "sans-serif"],
        rblack: ["Roboto-Black", "sans-serif"],
        rbold: ["Roboto-Bold", "sans-serif"],
        rlight: ["Roboto-Light", "sans-serif"],
        rmedium: ["Roboto-Medium", "sans-serif"],
        rregular: ["Roboto-Regular", "sans-serif"],
        rthin: ["Roboto-Thin", "sans-serif"],
      }
    },
  },
  plugins: [],
}