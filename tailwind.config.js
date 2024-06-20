const { addDynamicIconSelectors } = require("@iconify/tailwind");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), addDynamicIconSelectors()],
};
