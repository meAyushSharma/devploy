import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";
import * as glob from "glob";

const workerFiles = glob.sync("src/worker/*.js").reduce((acc, file) => {
  acc[path.basename(file, ".js")] = file;
  return acc;
}, {});

const mode = import.meta.env.VITE_MODE;

// https://vite.dev/config/
export default defineConfig({
  mode: VITE_MODE,
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true
    },
    // hmr: {
    //   host: 'localhost',
    // }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  build :{
    rollupOptions : {
      input : {
        main : "index.html",
        ...workerFiles,
      }
    }
  }
})
