module.exports = {
  mode: 'development',
  entry: './src/dp-factory.js',
  output: {
    path: __dirname + "/dist",
    filename: 'bundle.js',
    library: 'myApp'
  },
  watch: true
};