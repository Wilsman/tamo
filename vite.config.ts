import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  publicDir: "sprites",
  build: {
    outDir: "dist/renderer",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        pet: resolve(__dirname, "src/renderer/pet/index.html"),
        popover: resolve(__dirname, "src/renderer/popover/index.html"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || "";
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
            return "assets/[name][extname]";
          }
          return "[name][extname]";
        },
      },
    },
  },
  server: {
    port: 5173,
    fs: {
      strict: false,
    },
  },
});
