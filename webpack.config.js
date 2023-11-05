const path = require('path');

const config = {
  entry: './src/index.ts',
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    filename: 'natural-cron.es5.min.js',
    path: path.resolve(__dirname, 'dist', 'web'),
    libraryTarget: 'var',
    library: 'NaturalCron',
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'inline-source-map';
    config.output.filename = 'natural-cron.es5.js';
  }
  return config;
};
