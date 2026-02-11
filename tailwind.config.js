
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary)',
                'primary-dark': 'var(--color-primary-dark)',
                background: 'var(--color-background)',
                surface: 'var(--color-surface)',
            },
            fontFamily: {
                sans: ['var(--font-sans)', 'sans-serif'],
            },
            borderRadius: {
                'xl': 'var(--radius-xl)',
                '2xl': 'var(--radius-2xl)',
                '3xl': 'var(--radius-3xl)',
            },
        },
    },
    plugins: [],
}
