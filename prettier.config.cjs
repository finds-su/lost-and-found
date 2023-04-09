/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  semi: false,
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}

module.exports = config
