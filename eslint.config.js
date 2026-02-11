import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,
  {
    plugins: { prettier },
    rules: { "prettier/prettier": "error" }
  },
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node }
    },
    ignores: ["node_modules/", "package-lock.json"]
  }
];
