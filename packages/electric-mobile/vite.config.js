import vue from '@vitejs/plugin-vue2';

export default {
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  esbuild: true,
  plugins: [vue()],
  server: {
    open: true,
    port: 3000,
  }
};
