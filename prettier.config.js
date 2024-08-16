/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  $schema: 'http://json.schemastore.org/prettierrc',
  semi: true,
  arrowParens: 'always',
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  htmlWhitespaceSensitivity: 'css',
  insertPragma: false,
  tabWidth: 2,
  useTabs: false,
  vueIndentScriptAndStyle: true,
  endOfLine: 'lf',
};

export default config;
