'use strict';

module.exports = {
    mode: 'development',
    entry: './js/main.js',
    output: {
      path: __dirname + "/datapicker/dist",
      filename: 'bundle.js'
    },
    watch: true
};