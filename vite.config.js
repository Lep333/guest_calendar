import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import eslint from "vite-plugin-eslint";
import path from "path";

const isLib = process.env.BUILD === 'lib';

export default defineConfig({
    plugins: [
        vue(),
        eslint(),
    ],
    //add test to vite config
    test: {
        environment: "happy-dom",
    },
    build: isLib
        ? {
        lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'MyComponentLib',
        fileName: format => `my-component-lib.${format}.js`,
        },
        rollupOptions: {
        external: ['vue'],
        output: {
            globals: {
            vue: 'Vue'
            }
        }
    }
  } : undefined,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});