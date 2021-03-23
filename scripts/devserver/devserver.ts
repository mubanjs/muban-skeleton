import { createMockMiddleWare } from '@mediamonks/monck';
import { readFileSync } from 'fs';
import getPort from 'get-port';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { choosePort, prepareUrls } from 'react-dev-utils/WebpackDevServerUtils';
import openBrowser from 'react-dev-utils/openBrowser';
import clearConsole from 'react-dev-utils/clearConsole';
import { paths } from '../../config/paths';
import { getCompiler } from '../utils';
import { getAppTemplate, getPageData, startWatcher } from './getServerBundle';
import chalk from 'chalk';
import { handleCompilerInfo } from './utils';
import { createDevServerConfig } from './webpackDevServer.config';

const devMiddleware = require('webpack-dev-middleware');
const express = require('express');

const app = express();

const isInteractive = process.stdout.isTTY;

const clientConfig = require(paths.webpackClientConfig)();

app.use('/api/', createMockMiddleWare(path.resolve(paths.projectDir, 'mocks')));
app.use('/api/', (req, res) => res.sendStatus(404));

// app.use('/favicon.ico', (req, res) => {
//   res.send('df');
// });

const DEFAULT_PORT = parseInt(process.env.PORT!, 10) || 9000;
const HOST = process.env.HOST || '0.0.0.0';

if (process.env.HOST) {
  console.log(
    chalk.cyan(
      `Attempting to bind to HOST environment variable: ${chalk.yellow(
        chalk.bold(process.env.HOST),
      )}`,
    ),
  );
  console.log(`If this was unintentional, check that you haven't mistakenly set it in your shell.`);
  console.log(`Learn more here: ${chalk.yellow('https://cra.link/advanced-config')}`);
  console.log();
}

async function start() {
  const port = await choosePort(HOST, DEFAULT_PORT);
  const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';

  if (port) {
    const urls = prepareUrls(protocol, HOST, port, paths.publicPath.slice(0, -1));

    const proxy = {};

    const serverConfig = createDevServerConfig(proxy, urls.lanUrlForConfig);

    WebpackDevServer.addDevServerEntrypoints(clientConfig, serverConfig);

    const clientCompiler = webpack(clientConfig);
    const serverCompiler = getCompiler(require(paths.webpackServerConfig));

    let watcher: webpack.Watching;
    // delay starting the serverCompiler until the client WebpackDevServer is succesful
    // - starting them both at the same time makes them WAY slower somehow
    // - if the normal build has errors, delay the
    let devServerDidSuccessfulCompile = false;
    clientCompiler.hooks.done.tap('done', (stats) => {
      const isSuccessful = !stats.hasErrors();
      if (isSuccessful && !devServerDidSuccessfulCompile) {
        setTimeout(() => {
          watcher = startWatcher(serverCompiler);
        }, 1000);

        // can't "untap" hooks :(
        // https://github.com/webpack/tapable/issues/109
        devServerDidSuccessfulCompile = true;
      }
    });

    const devSocket = {
      warnings: (warnings) => devServer.sockWrite(devServer.sockets, 'warnings', warnings),
      errors: (errors) => devServer.sockWrite(devServer.sockets, 'errors', errors),
    };

    // taps into the compiler and output all watch/build/error/success info
    handleCompilerInfo(
      {
        client: clientCompiler,
        server: serverCompiler,
      },
      { urls, devSocket },
    );

    const devServer = new WebpackDevServer(clientCompiler, serverConfig);

    devServer.listen(port, HOST, (err) => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      openBrowser(urls.localUrlForBrowser);
    });

    ['SIGINT', 'SIGTERM'].forEach(function (sig) {
      process.on(sig, function () {
        devServer.close();
        watcher && watcher.close(() => {});
        process.exit();
      });
    });

    if (process.env.CI !== 'true') {
      // Gracefully exit when stdin ends
      process.stdin.on('end', function () {
        devServer.close();
        watcher && watcher.close(() => {});
        process.exit();
      });
    }
  }
}

start();
