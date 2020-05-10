const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

const common = {
  mode: 'development',
  // watch: true,
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { modules: true },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.ts?$/,
        // use: 'ts-loader',
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
    ],
  },
  node: {
    __dirname: false,
  },
  plugins: [new VueLoaderPlugin()],
};

const client = {
  ...common,
  entry: ['./src/app.ts'],
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: 'main.js',
  },
};

const server = {
  ...common,
  entry: ['./src/server.ts'],
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
};

module.exports = [client, server];
