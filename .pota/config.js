export default {
  extends: "@pota/webpack-skeleton",
  scripts: [
    "dev",
    "build",
    "build:preview",
    "storybook",
    "storybook:build",
    "apply-storybook-patches",
    "rsync",
    "rsync:mocks",
  ],
  omit: ["public/index.html", "public/manifest.json", "public/robots.txt", "public/favicon.ico"],
};
