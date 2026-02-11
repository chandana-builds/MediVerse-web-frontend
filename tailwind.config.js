
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                // Hardcoded fallback to ensure colors work even if CSS variables fail to load
                primary: '#2563EB', // Blue-600
                'primary-dark': '#1E40AF', // Blue-800
                background: '#F8FAFC', // Slate-50
                surface: '#FFFFFF', // White
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Fallback to Inter directly
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
