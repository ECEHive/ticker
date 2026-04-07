import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
    // Files to ignore entirely
    { ignores: ["dist", "**/*.d.ts"] },

    // Node.js config files
    {
        files: ["*.config.js", "*.config.ts", "postcss.config.js"],
        languageOptions: {
            globals: { ...globals.node },
        },
    },

    // TypeScript source files
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            parser: tseslint.parser,
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                sourceType: "module",
            },
        },
        settings: { react: { version: "18.3" } },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
            "@typescript-eslint": tseslint.plugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs["jsx-runtime"].rules,
            ...reactHooks.configs.recommended.rules,
            "no-undef": "off", // TypeScript handles this
            "no-unused-vars": "off", // Replaced by @typescript-eslint/no-unused-vars
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
            "react/jsx-no-target-blank": "off",
            "react-refresh/only-export-components": "off", // Context files intentionally export both context and provider
            "no-empty-pattern": "off",
            "react/prop-types": "off",
        },
    },
];
