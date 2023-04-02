module.exports = {
  'src/**/*.{js,vue}': 'node common/scripts/install-run-rush.js eslint',
  'src/**/*.{vue}': 'node common/scripts/install-run-rush.js stylelint'
};
