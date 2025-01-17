import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths"

const workerImportMetaUrlRE =
  /\bnew\s+(?:Worker|SharedWorker)\s*\(\s*(new\s+URL\s*\(\s*('[^']+'|"[^"]+"|`[^`]+`)\s*,\s*import\.meta\.url\s*\))/g;

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  worker: {
    format: "es",
    //@ts-ignore
    plugins: [
      {
        name: "foo",
        enforce: "pre",
        transform(code) {
          if (
            code.includes("new Worker") &&
            code.includes("new URL") &&
            code.includes("import.meta.url")
          ) {
            const result = code.replace(
              workerImportMetaUrlRE,
              `((() => { throw new Error('Nested workers are disabled') })()`,
            );
            return result;
          }
        },
      },
    ],
    rollupOptions: {
      output: {
        chunkFileNames: "assets/worker/[name]-[hash].js",
        assetFileNames: "assets/worker/[name]-[hash].js",
      },
    },
  },
  plugins: [react(), tsconfigPaths()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
