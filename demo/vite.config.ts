import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const path = (value: string) => fileURLToPath(new URL(value, import.meta.url));

export default defineConfig({
  root: path("."),
  base: "./",
  esbuild: { jsx: "automatic" },
  resolve: {
    alias: [
      { find: "next/link", replacement: path("./link.tsx") },
      { find: "next/navigation", replacement: path("./navigation.ts") },
      { find: "@/features/finance/actions", replacement: path("./actions.ts") },
      { find: "@", replacement: path("../src") },
    ],
  },
  css: { postcss: path("..") },
  build: {
    outDir: path("../dist/demo"),
    emptyOutDir: true,
    rollupOptions: {
      output: { manualChunks: { react: ["react", "react-dom/client"], charts: ["recharts"], validation: ["zod"] } },
    },
  },
});
