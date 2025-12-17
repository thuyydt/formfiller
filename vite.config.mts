import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'manifest.json', dest: '.' },
        { src: 'icons/*', dest: 'icons' },
        { src: 'options.css', dest: '.' },
        { src: 'options.html', dest: '.' }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: process.env.NODE_ENV === 'development',
    minify: process.env.NODE_ENV === 'production' ? 'terser' : false,
    target: 'es2020',
    cssMinify: true,
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
      input: {
        options: resolve(__dirname, 'options.ts')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        format: 'es'
      },
      treeshake: {
        moduleSideEffects: id => {
          // Preserve side effects for options page (custom element registration)
          if (id.includes('options.ts') || id.includes('components/')) {
            return true;
          }
          return false;
        },
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 600,
    reportCompressedSize: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@components': resolve(__dirname, './components'),
      '@helpers': resolve(__dirname, './helpers'),
      '@forms': resolve(__dirname, './forms'),
      '@lib': resolve(__dirname, './lib')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  server: {
    hmr: {
      protocol: 'ws',
      host: 'localhost'
    }
  }
});
