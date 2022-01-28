const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
    production: {
      publicPath: '/',
    },
  },
  alias: {
    '@': path.resolve(__dirname, 'src/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  hash: true,
  copy: [
    {
      from: 'mock',
      to: 'electric',
    },
    {
      from: '_redirects',
    }
  ],
};
