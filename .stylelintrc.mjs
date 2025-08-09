/** @type {import('stylelint').Config} */
export default {
  extends: [
    'stylelint-config-standard',
  ],
  rules: {
    'selector-class-pattern': [
      '^([A-Z][a-z0-9]*)([a-zA-Z0-9]+)*$',
      {
        message: selector => `Expected class selector "${selector}" to be PascalCase`,
      },
    ],
  },
}
