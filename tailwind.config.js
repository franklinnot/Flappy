import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans],
            },
            screens: {
                lt: "448px",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                progressBar: {
                    "0%": { width: "100%" },
                    "100%": { width: "0%" },
                },
            },
            animation: {
                "fade-in": "fadeIn 0.2s ease-out forwards",
                "progress-bar": "progressBar 5s linear forwards", // Opción por defecto (no se usará con duración dinámica)
            },
        },
    },

    plugins: [forms],
};
