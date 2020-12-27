import { createMockMiddleWare } from '@mediamonks/monck';
import { readFileSync } from 'fs';
import path from 'path';
import webpack from 'webpack';
import { paths } from '../../config/paths';
import { getAppTemplate, getPageData } from './getServerBundle';

const middleware = require('webpack-dev-middleware');
const express = require('express');


const app = express();

const compiler = webpack(require(paths.webpackClientConfig));

// const Mod = require('module');
// const req = Mod.prototype.require;
// Mod.prototype.require = function () {
//     // ignore certain imports not supported in node
//   if (arguments[0].endsWith('.scss')) {
//     return;
//   }
//   return req.apply(this, arguments);
// };

// nodemon is not reloading on layout/page files, so load them uncached
// might need to invalidate the cache for everything on each request, since layouts will require other layouts...
function requireUncached(module) {
  delete require.cache[require.resolve(module)];
  return require(module);
}

app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
  })
);

app.use('/api/', createMockMiddleWare(path.resolve(paths.projectDir, 'mocks')));
app.use('/api/', (req, res) => res.sendStatus(404));

app.use('/favicon.ico', (req, res) => {
  res.send('df');
});
app.use('/', async (req, res) => {
  console.log('[request]', req.path);

  const pageData = await getPageData(req.path);
  console.log('[page data]', pageData);
  const templateResult = await getAppTemplate(pageData);

  res.send(
    readFileSync(path.resolve(__dirname, './index.html'), 'utf-8')
      .replace('{{content}}', templateResult)
  );
});

app.listen(9000, () => console.log('Example app listening on port 9000!'));
