/** @type {import('tailwindcss').Config} */
const { themeVariants, prefersLight, prefersDark } = require("tailwindcss-theme-variants");

const defaultTypograhyStyle = {
    marginTop: ".6em",
    marginBottom: ".25em",
};

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: ['"Sora"', "sans-serif"],
            serif: ['"Sora"', "serif"],
            body: ['"Sora"', "sans-serif"],
            mono: ['"Azeret Mono"', "monospace"],
        },
        extend: {
            typography: {
                "2xl": {
                    css: {
                        fontSize: "4em",
                        h1: {
                            ...defaultTypograhyStyle,
                            marginBottom: ".2em",
                            lineHeight: "1em",
                        },
                        h2: {
                            ...defaultTypograhyStyle,
                            lineHeight: "1em",
                        },
                        h3: {
                            ...defaultTypograhyStyle,
                            lineHeight: "1em",
                        },
                        h4: {
                            ...defaultTypograhyStyle,
                            lineHeight: "1em",
                        },
                        p: {
                            ...defaultTypograhyStyle,
                            fontSize: "1.275em",
                            lineHeight: "1.2em",
                        },
                        hr: {
                            marginTop: "1em",
                            marginBottom: "1em",
                        },

                        table: {
                            fontSize: "1em",
                            marginBottom: ".8em",
                            marginTop: ".8em",
                        },
                    },
                },
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
        themeVariants({
            themes: {
                light: {
                    mediaQuery: prefersLight /* "@media (prefers-color-scheme: light)" */,
                },
                dark: {
                    mediaQuery: prefersDark /* "@media (prefers-color-scheme: dark)" */,
                },
            },
        }),
    ],
};
