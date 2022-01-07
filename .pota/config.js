export default {
  extends: "@pota/webpack-skeleton",
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
  omit: ["public/index.html", "public/manifest.json", "public/robots.txt", "public/favicon.ico"],
};
