module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine'],
      reporters: ['progress', 'coverage'],
      coverageReporter: {
        type: 'html',
        dir: './coverage/',
        file: 'coverage.html'
      },
      preprocessors: {
        'test/*.js': [ 'webpack', 'coverage' ],
      },
      plugins: [
        'karma-jasmine',
        'karma-chrome-launcher',
        'karma-coverage',
        'karma-webpack'
    ],
      files: [
        'test/*.js'
      ],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false
    });
  };