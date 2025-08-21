import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import removeConsole from 'vite-plugin-remove-console';
import path from "path";
import * as glob from "glob";

const workerFiles = glob.sync("src/worker/*.js").reduce((acc, file) => {
  acc[path.basename(file, ".js")] = file;
  return acc;
}, {});

export default defineConfig({
  mode: "production",
  plugins: [react(), removeConsole()],
  server: {
    host: true,
    watch: {
      usePolling: true
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        ...workerFiles,
      },
      output: {
        entryFileNames: (chunk) => {
          // Workers go into /worker/ without hash
          if (chunk.name in workerFiles) {
            return `worker/${chunk.name}.js`;
          }
          // Everything else keeps normal hashing
          return `assets/[name]-[hash].js`;
        },
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      }
    }
  }
})