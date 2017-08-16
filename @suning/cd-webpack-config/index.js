const fs = require('fs')
const path = require('path')

module.exports = fs.readFileSync(path.resolve(__dirname, './src/webpack.config.js'), 'utf8')