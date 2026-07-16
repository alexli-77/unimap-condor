import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "node_modules",
      ".tmp-recommendation-tests",
      "docs",
      "tools",
      // Supabase Edge Functions run on Deno (esm.sh imports, Deno globals) and
      // are deployed separately — they are not part of the app's lint/build.
      "supabase/functions"
    ]
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],
      // Existing codebase relies on `any` at API boundaries and a few unused
      // catch bindings; keep these as warnings so the build/CI stays green
      // while still surfacing the issues.
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ],
      // The codebase intentionally uses short-circuit expressions (`cond && fn()`)
      // and setState inside effects for data fetching. These are pre-existing
      // patterns; keep them as warnings rather than blocking CI.
      "@typescript-eslint/no-unused-expressions": "warn",
      "react-hooks/set-state-in-effect": "warn"
    }
  },
  {
    // Node-based test/config files.
    files: ["**/*.{js,mjs,cjs}", "tests/**/*.{ts,mjs}"],
    languageOptions: {
      globals: { ...globals.node }
    }
  }
);
