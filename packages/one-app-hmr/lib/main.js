import webpack from 'webpack';
import merge from 'webpack-merge';
// import DashboardPlugin from 'webpack-dashboard/plugin';
import devMiddleware from 'webpack-dev-middleware';
import Server from 'webpack-dev-server/lib/Server';

import hmrConfigSet from './webpack.config';

async function startDevServer() {
  const [staticsConfig, modulesConfig] = hmrConfigSet;

  const config = merge(modulesConfig, {
    devServer: {
      publicPath: 'http://localhost:3001/dist',
      index: 'index.html',
      compress: true,
      port: 3001,
      hot: true,
      inline: true,
      stats: 'minimal',
      open: {
        app: ['Google Chrome', '--incognito'],
      },
      // leave server for reminder for parrot integration
      before: app => {
        app.use(
          devMiddleware(webpack(staticsConfig), {
            // webpack-dev-middleware options
          })
        );
        // app.get('/', (req, res) => {
        //   res
        //     .status(200)
        //     .type('html')
        //     .sendFile(path.resolve(process.cwd(), 'src/index.html'));
        // });
      },
    },
  });
  config.output.publicPath = config.devServer.publicPath;
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  // compiler.apply(new DashboardPlugin());

  const { host = 'localhost', port = 8080, socket } = config.devServer;

  const server = new Server(compiler, {
    ...config.devServer,
    host,
    port,
    socket,
  });

  // eslint-disable-next-line arrow-parens
  server.listen(port, host, err => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log('Webpack dev server listening on port:', port);
  });

  return server;
}

// eslint-disable-next-line wrap-iife
(async function start() {
  await startDevServer();
})({
  modules: [
    {
      name: 'holocron-module',
      path: '',
    },
  ],
});
