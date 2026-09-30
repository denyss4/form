// Expo's flat config plus the Master's rule: no hard-coded colour, spacing, type or radius values
// outside packages/tokens (MASTER_PROMPT §5.1, §5.2, §5.3, §5.4).
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

const use = 'Use a token from @tokens.';
const spacingKeys = '^(margin|padding)|^(gap|rowGap|columnGap)$';
const typeKeys = '^(fontSize|lineHeight|letterSpacing)$';
const radiusKeys = 'Radius$';

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/*',
      '.expo/*',
      'pmdata/**',
      'form-model/**',
      'FORM-ML-Kit/**',
      'FORM-ML-Kit-v2/**',
      'hiring-agent/**',
      'Inspirations/**',
      'Fonts/**',
      'Components/**',
      'Skills/**',
      'packages/model/predict.mjs',
      'packages/model/verify.mjs',
    ],
  },
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#[0-9a-fA-F]{3,8}$/]',
          message: `Hard-coded hex colour. ${use}`,
        },
        {
          selector: 'Literal[value=/^(rgb|hsl)a?\\(/]',
          message: `Hard-coded rgb/hsl colour. ${use}`,
        },
        {
          selector: `Property[key.name=/[cC]olor$/][value.type='Literal'][value.value!='transparent']`,
          message: `Hard-coded colour value. ${use}`,
        },
        {
          selector: `Property[key.name=/${spacingKeys}/]:matches([value.type='Literal'][value.value!=0], [value.type='UnaryExpression'])`,
          message: `Hard-coded spacing value. ${use}`,
        },
        {
          selector: `Property[key.name=/${typeKeys}/][value.type='Literal']`,
          message: `Hard-coded type value. ${use}`,
        },
        {
          selector: `Property[key.name=/${radiusKeys}/][value.type='Literal'][value.value!=0]`,
          message: `Hard-coded radius value. ${use}`,
        },
      ],
    },
  },
  {
    // The tokens are where the literals live.
    files: ['packages/tokens/**'],
    rules: { 'no-restricted-syntax': 'off' },
  },
]);
