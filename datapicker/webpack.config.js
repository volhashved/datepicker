module.exports = {
  mode: 'development',
  entry: './src/dp.js',
  output: {
    path: __dirname + "/dist",
    filename: 'bundle.js',
    library: 'myApp'
  },
  watch: true
};