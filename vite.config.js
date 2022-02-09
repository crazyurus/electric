import { createVuePlugin } from 'vite-plugin-vue2';

export default {
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  esbuild: true,
  plugins: [createVuePlugin()],
  server: {
    open: true
  }
};
