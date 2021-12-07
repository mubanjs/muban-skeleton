export default {
  extends: "@pota/webpack-skeleton",
  scripts: ["build", "storybook", "storybook:build", "apply-storybook-patches"],
  omit: ["public/index.html", "public/manifest.json", "public/robots.txt", "public/favicon.ico"]
};
