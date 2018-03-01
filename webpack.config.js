const path = require('path');
const PATH_DIST = path.join(__dirname, 'dist');
const PATH_DIST_DASHBOARD = path.join(PATH_DIST, './dashboard');
const PATH_DIST_PUBLIC = path.join(PATH_DIST, './public');
const PATH_CLIENT = path.join(__dirname, 'client');
const PATH_CLIENT_DASHBOARD = path.join(PATH_CLIENT, './dashboard');
const PATH_CLIENT_PUBLIC = path.join(PATH_CLIENT, './public');

const commonConfig = {
  mode: 'development',
  context: PATH_CLIENT,
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': PATH_CLIENT,
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};

const publicConfig = {
  ...commonConfig,
  name: 'public',
  entry: './public/main.js',
  output: {
    filename: 'bundle-[name].js',
    path: PATH_DIST_PUBLIC
  }
};
publicConfig.resolve.alias["@"] = PATH_CLIENT_PUBLIC;

const dashboardConfig = {
  ...commonConfig,
  name: 'dashboard',
  entry: './dashboard/main.js',
  output: {
    filename: 'bundle-[name].js',
    path: PATH_DIST_DASHBOARD
  }
};
dashboardConfig.resolve.alias["@"] = PATH_CLIENT_DASHBOARD;

module.exports = [publicConfig, dashboardConfig];