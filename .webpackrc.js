const path = require('path');

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
    production: {
      publicPath: '/Application/Electric/Assets/pc/',
    },
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
    assets: path.resolve(__dirname, 'src/assets/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  disableDynamicImport: true,
  hash: true,
};
