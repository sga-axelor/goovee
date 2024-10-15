module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-embed', 'prettier-plugin-sql'],
  embeddedSqlTags: ['sql'],
  language: 'postgresql',
  keywordCase: 'upper',
};
