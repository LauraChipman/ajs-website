/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                neon: ['"Bebas Neue"', 'cursive'],
                body: ['"Silkscreen"', 'sans-serif']
            }
        },
    },
    plugins: [],
};
