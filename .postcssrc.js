// https://github.com/michael-ciniawsky/postcss-load-config

const path = require('path')

module.exports = {
  "plugins": [
    require('postcss-import'),
    require('postcss-inject')({}),
    require('precss'),
    require('autoprefixer'),
    require('rucksack-css')
  ]
}
