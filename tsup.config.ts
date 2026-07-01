import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs"],
    clean: true,
    minify: true,
    sourcemap: false,
    tsconfig: "tsconfig.json"
});
