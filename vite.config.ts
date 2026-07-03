import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
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
