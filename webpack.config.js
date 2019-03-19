'use strict';

module.exports = {
    mode: 'development',
    entry: './datapicker/src/dp.js',
    output: {
      path: __dirname + "/datapicker/dist",
      filename: 'bundle.js',
      library: 'myApp'
    },
    watch: true
};