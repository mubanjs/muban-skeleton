import { options as webpackSkeletonOptions } from "@pota/webpack-skeleton/.pota/commands/dev.js"

export { description, action } from "@pota/webpack-skeleton/.pota/commands/dev.js"

export const options = [
  ...webpackSkeletonOptions,
  {
    option: '--mock-api',
    description: 'Toggles support for API mocks',
    default: false
  },
];

