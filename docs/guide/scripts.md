# Scripts

The `package.json` is filled with scripts you can use to do all sorts of things in your project. The most important
ones are described below. 

## Development 

### `yarn dev`

Your goto script when running local development against local page templates with live and hot reloading when any of
your code changes.

- runs the code bundle with `webpack-dev-middleware`, hot-reloading your JS and CSS changes
- runs the server bundle to generate templates and serves them from express, live-reloading your HTML changes

The dev server runs on `http://localhost:9000`.

### `yarn build --watch`

Runs the same build process as the normal `yarn build`, but now in watch mode, enjoying super fast recompilations when
your local files change.

 
### `yarn build:debug -- watch`

Runs the same build process as the normal `yarn build:debug`, but now in watch mode, enjoying super fast recompilations
when your local files change.

Very useful for live local development against your CMS rendered pages.

### `yarn storybook`

Develop and test your components in storybook.


## Builds

### `yarn build`

Creates a distribution build that outputs the JS and CSS files. Used in CI to deploy to your production websites.

### `yarn build:preview`

Generates a full preview package including generated HTML files to upload to a preview server that's not connected to
any backend.
 
### `yarn build:debug`

Generates a quick debug build without any minification and other optimizations. Useful for quick integration tests
where you're not deploying to production yet, but want to see your changes on a (local) integration server as fast
as possible.

### `yarn storybook:build`

Make a deployable storybook build to showcase your components to others.

### `yarn preview`

Start a local server to see the result of `yarn build:preview`

The dev server runs on `http://localhost:9001`.


## Others

### `yarn test`

> TODO

### `yarn test:e2e`

> TODO

### `yarn lint`

> TODO

### `yarn analyze`

> TODO
