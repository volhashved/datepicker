module.exports = function(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine'],
      reporters: ['progress'],
      coverageReporter: {
        type: 'text',
        dir: './coverage/',
        file: 'coverage.txt'
      },
      files: [
        'test/*.js'
      ],
      reporters: ['dots'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: true,
      browsers: ['Chrome'],
      singleRun: false
    });
  };