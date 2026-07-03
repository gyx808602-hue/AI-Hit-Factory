import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { getManualChunkName } from "./src/build/manualChunks";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: getManualChunkName,
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    include: ["src/__tests_disabled__/**/*.test.ts", "src/__tests_disabled__/**/*.test.tsx"],
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "src/**/*.spec.ts",
      "src/**/*.spec.tsx",
    ],
    passWithNoTests: true,
  },
  server: {
   proxy: {
    "/api": {
      // Target 保持最纯粹的根域名/IP
      target: "http://192.168.77.204:8080", 
      // target: "http://47.96.142.28:8000",
      changeOrigin: true,
      // 在重写规则里，把 /api 替换成后端实际需要的前缀
      rewrite: (path) => path.replace(/^\/api/, "/api/v1"), 
    },
  },
}
});