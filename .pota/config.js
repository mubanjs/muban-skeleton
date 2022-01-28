import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { define } from '@pota/authoring';

import webpackSkeleton from '@pota/webpack-skeleton';

export const commonOptions = [define.option('mock-api', 'Toggles support for building API mocks')];

export default define(webpackSkeleton, {
  dirname: dirname(fileURLToPath(import.meta.url)),
  scripts: [
    "dev",
    "build",
    "build:preview",
    "storybook",
    "storybook:mock-api",
    "storybook:build",
    "apply-storybook-patches",
    "rsync",
    "rsync:mocks",
    "rsync:storybook",
  ],
  omit: [
    "public/index.html",
    "public/manifest.json",
    "public/robots.txt",
    "public/favicon.svg",
    "public/favicon-192.png",
    "public/favicon-512.png",
    "src/serviceWorkerRegistration.ts",
    "static",
  ],
  commands: {
    build: {
      options: [
        ...commonOptions,
        define.option('preview', 'Toggles support for building the preview'),
      ],
    },
    dev: {
      options: commonOptions,
    }
  },
  meta: {
    async webpack(options, babelConfig) {
      const [config, createMubanConfig] = await Promise.all([
        webpackSkeleton.meta.webpack(options, babelConfig),
        import('./webpack/webpack.config.js').then(m => m.default)
      ]);

      return createMubanConfig(config, options);
    }
  }
});
