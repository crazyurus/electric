const path = require('path');
const { getPlugin, pluginByName } = require('@craco/craco');
const CracoLessPlugin = require('craco-less');
const CracoCSSModulesPlugin = require('craco-css-modules');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');
const theme = require('./theme');
const isProduction = process.env.NODE_ENV === 'production';
const isAnalysis = process.env.ANALYSE === 'TRUE';

process.env.BUILD_PATH = path.resolve('./dist');
process.env.GENERATE_SOURCEMAP = !isProduction.toString();

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: theme,
            math: 'always',
            javascriptEnabled: true,
          },
        },
      },
    },
    {
      plugin: CracoCSSModulesPlugin,
    },
  ],
  style: {
    modules: {
      localIdentName: '[local]--[hash:base64:5]',
      exportLocalsConvention: 'camelCase',
    },
  },
  webpack: {
    alias: {
      '@': path.resolve('./src'),
    },
    plugins: {
      add: [
        new SubresourceIntegrityPlugin({
          hashFuncNames: ['sha256', 'sha512'],
          enabled: isProduction,
        }),
        new CopyPlugin({
          patterns: [
            {
              from: '_redirects',
            }
          ],
        }),
      ].concat(isAnalysis ? [new BundleAnalyzerPlugin(), new SpeedMeasurePlugin()] : []),
      remove: ['WebpackManifestPlugin', 'ESLintWebpackPlugin'],
    },
    configure(options) {
      options.output.crossOriginLoading = 'anonymous';

      const { isFound, match } = getPlugin(options, pluginByName('MiniCssExtractPlugin'));
      if (isFound) {
        match.options.ignoreOrder = true;
      }

      return options;
    },
  },
  babel: {
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-function-bind',
      ['babel-plugin-import', {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true,
      }],
    ],
  },
};
