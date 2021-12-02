export default {
  extends: "@pota/webpack-skeleton",
  scripts: ["build", "storybook", "storybook:build", "apply-storybook-patches"],
  omit: ["public"]
};
