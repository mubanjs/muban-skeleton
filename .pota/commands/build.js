import { options as webpackSkeletonOptions } from "@pota/webpack-skeleton/.pota/commands/build.js"

export { description, action } from "@pota/webpack-skeleton/.pota/commands/build.js"

export const options = [
  ...webpackSkeletonOptions,
  {
    option: '--preview',
    description: 'Toggles support for building the preview',
  },
  {
    option: '--mock-api',
    description: 'Toggles support for building API mocks',
    default: false
  },
];

