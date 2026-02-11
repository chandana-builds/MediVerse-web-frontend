
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#28328c',
                'primary-dark': '#1a237e',
                background: '#f8fafc',
                surface: '#ffffff',
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
        },
    },
    plugins: [],
}
