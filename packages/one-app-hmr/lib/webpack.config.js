const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SriPlugin = require('webpack-subresource-integrity');
const { fromJS, Set: iSet } = require('immutable');
const transit = require('transit-immutable-js');

const modules = ['root-holocron-module', 'holocron-module'];

function createInitialState(initialState) {
  return JSON.stringify(transit.toJSON(fromJS(initialState)));
}

const base = {
  profile: true,
  target: 'web',
  devtool: 'source-map',
  mode: 'development',
  context: process.cwd(),
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
    ],
  },
};

const externals = {
  '@americanexpress/one-app-router': {
    var: 'OneAppRouter',
    commonjs2: '@americanexpress/one-app-router',
  },
  'create-shared-react-context': {
    var: 'CreateSharedReactContext',
    commonjs2: 'create-shared-react-context',
  },
  holocron: {
    var: 'Holocron',
    commonjs2: 'holocron',
  },
  react: {
    var: 'React',
    commonjs2: 'react',
  },
  'react-dom': {
    var: 'ReactDOM',
    commonjs2: 'react-dom',
  },
  redux: {
    var: 'Redux',
    commonjs2: 'redux',
  },
  'react-redux': {
    var: 'ReactRedux',
    commonjs2: 'react-redux',
  },
  reselect: {
    var: 'Reselect',
    commonjs2: 'reselect',
  },
  immutable: {
    var: 'Immutable',
    commonjs2: 'immutable',
  },
  '@americanexpress/one-app-ducks': {
    var: 'OneAppDucks',
    commonjs2: '@americanexpress/one-app-ducks',
  },
  'holocron-module-route': {
    var: 'HolocronModuleRoute',
    commonjs2: 'holocron-module-route',
  },
  'prop-types': {
    var: 'PropTypes',
    commonjs2: 'prop-types',
  },
  'react-helmet': {
    var: 'ReactHelmet',
    commonjs2: 'react-helmet',
  },
};

module.exports = [
  merge(base, {
    entry: {
      'dev-client': path.join(process.cwd(), 'lib/client/index.js'),
    },
    plugins: [
      // copy over the statics
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(
              process.cwd(),
              'node_modules/@americanexpress/one-app-statics/build/app',
              '5.0.0-46b4da37'
            ),
            to: 'app',
          },
        ],
      }),
    ],
  }),
  merge(base, {
    externals,
    // TODO: required with SRI plugin - find a way to set it to 'development'
    mode: 'production',
    // TODO: make dynamic
    entry: {
      'modules/Root': [
        'react-hot-loader/patch',
        path.join(process.cwd(), 'lib/modules/Root.jsx'),
      ],
      'modules/Module': [
        'react-hot-loader/patch',
        path.join(process.cwd(), 'lib/modules/Module.jsx'),
      ],
    },
    output: {
      publicPath: '/',
      library: 'holocronModule',
      libraryExport: 'default',
      crossOriginLoading: 'anonymous',
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'lib/index.ejs',
        inject: false,
        templateParameters: {
          modules,
          initialState: createInitialState({
            config: {
              cdnUrl: '/',
              rootModuleName: 'root-holocron-module',
            },
            intl: {
              activeLocale: 'en-US',
            },
            holocron: {
              loaded: iSet(),
            },
          }),
        },
      }),
      new SriPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: true,
      }),
    ],
  }),
];
