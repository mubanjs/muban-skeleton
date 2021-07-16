# 🚀 Welcome to your new awesome project!

## Scripts

### `yarn dev`

Your goto script when running local development against local page templates with live and hot reloading when any of
your code changes.

- runs the code bundle with `WebpackDevServer`, hot-reloading your JS and CSS changes
- runs the server bundle to generate templates and serves them from express, live-reloading your HTML changes

The dev server runs on `http://localhost:9000`.

### `yarn build`

Creates a distribution build that outputs the JS and CSS files. Used in CI to deploy to your production websites.

Append `--watch` to the command to start this webpack in watch mode, enjoying super fast recompilations when your
local files changes.

When the `MUBAN_ANALYZE` environment variable is set, it will generate a bundle-analyzer output 
report.

### `yarn build:preview`

Generates a full preview package including generated HTML files to upload to a preview server that's not connected to
any backend.
 
### `yarn build:debug`

Generates a quick debug build without any minification and other optimizations. Useful for quick integration tests
where you're not deploying to production yet, but want to see your changes on a (local) integration server as fast
as possible.

Append `--watch` to the command to start this webpack in watch mode, enjoying super fast recompilations when your
local files changes. Very useful for live local development against your CMS rendered pages.

### `yarn storybook`

Develop and test your components in storybook.

### `yarn storybook:build`

Make a deployable storybook build to showcase your components to others.

### `yarn preview`

Start a local server to see the result of `yarn build:preview`

The dev server runs on `http://localhost:9001`.

### `yarn test`

> TODO

### `yarn test:e2e`

> TODO

### Content Security Policy ([CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP))

This application has been build with a [strict content security policy](https://csp.withgoogle.com/docs/strict-csp.html). To enforce this policy 
add the following CSP header to the request response.

`Content-Security-Policy: script-src 'sha256-+OVgFCkyF2/rZ6qyfsNnIisCRI6dtMZw3w0Y4xiYagw=' 'strict-dynamic' https: 'unsafe-inline'; object-src 'none'; base-uri 'none';`

