module.exports = {
  'src/**/*.{js,vue}': '../../common/scripts/lint-staged.sh eslint',
  'src/**/*.vue': '../../common/scripts/lint-staged.sh stylelint'
};
