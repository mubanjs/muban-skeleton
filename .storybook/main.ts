import jsonImporter from 'node-sass-json-importer'
import { paths } from '../config/paths';

export default {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    //   "@storybook/addon-links",
    //   "@storybook/addon-essentials"
    {
      name: '@storybook/preset-scss',
      options: {
        sassLoaderOptions: {
          sassOptions: {
            importer: jsonImporter(),
          },
          additionalData: `
            @import "~seng-scss";
            @import "${paths.srcPath
              .substring(paths.projectDir.length)
              .replace(/\\/g, '/')}/styles/_global.scss";
          `,
        },
      },
    },
  ],
};
