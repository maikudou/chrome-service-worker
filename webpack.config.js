const path = require('path')
module.exports = {
  entry: {
    worker: './src/worker.ts',
    'content-script': './src/content-script.ts'
  },
  output: { path: path.resolve(__dirname, 'dist'), filename: '[name].js' },
  devtool: 'inline-source-map',
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
  },
  resolve: {
    extensions: ['.ts']
  }
}
