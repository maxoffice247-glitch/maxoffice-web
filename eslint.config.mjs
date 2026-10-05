import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Test chạy bằng `node --test` (CommonJS, nạp file TS qua tests/ts-register.cjs) — không thuộc mã ứng dụng.
    "tests/**",
  ]),
]);

export default eslintConfig;
