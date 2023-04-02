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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          echarts: ['echarts'],
          framework7: ['framework7', 'framework7-vue'],
          vue: ['vue', 'vuex'],
          mint: ['mint-ui']
        }
      }
    }
  }
};
