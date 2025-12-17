import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // Don't clear dist folder (options.js builds first)
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    target: 'es2020',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.debug'] : [],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    },
    rollupOptions: {
      input: resolve(__dirname, 'background.ts'),
      output: {
        entryFileNames: 'background.js',
        format: 'es',
        // MV3 Service Worker requirement: No code splitting!
        inlineDynamicImports: true
      }
    },
    reportCompressedSize: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@helpers': resolve(__dirname, './helpers'),
      '@lib': resolve(__dirname, './lib')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
});
