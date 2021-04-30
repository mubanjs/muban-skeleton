module.exports = {
  'src/**/*.{js,ts,scss,json}': [
    'prettier --write',
    'git add'
  ],
  'src/**/*.{js,ts}': 'eslint --ext .js,.ts --cache --fix',
  'src/**/*.scss': 'stylelint --cache --fix'
};


