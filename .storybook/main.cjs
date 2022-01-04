const CSS_TEST = /\.css$/;
const SCSS_TEST = /\.(scss|sass)$/;

const ENABLE_MOCK_API_MIDDLEWARE = process.env.MOCK_API === "true";

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: ["../public", "../src/pages/public", "static"],
  addons: ["@storybook/addon-essentials", "@mediamonks/muban-storybook-addon-transition"],
  async webpackFinal(config) {
    const { createFindPlugin } = await import("@pota/webpack-skeleton/.pota/webpack/util.js");

    const [mubanConfig] = await getConfigs();

    const findPlugin = createFindPlugin(mubanConfig);
    const miniCssExtractLoader = findPlugin("MiniCssExtractPlugin").constructor.loader;

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: { ...config.resolve.alias, ...mubanConfig.resolve.alias },
      },
      module: {
        ...config.module,
        rules: mubanConfig.module.rules.map((rule) =>
          // storybook needs the standard `style-loader`
          [String(CSS_TEST), String(SCSS_TEST)].includes(String(rule.test))
            ? {
                ...rule,
                use: rule.use.map((use) => (use === miniCssExtractLoader ? "style-loader" : use)),
              }
            : rule
        ),
      },
      plugins: [...config.plugins, findPlugin("DefinePlugin")],
    };
  },
  async managerWebpack(config) {
    if (!ENABLE_MOCK_API_MIDDLEWARE) return config;

    const [, , mocksConfig] = await getConfigs();

    return [config, mocksConfig];
  },
};

async function getConfigs() {
  const { getNestedConfigs, createConfig } = await import(
    "@pota/webpack-skeleton/.pota/webpack/util.js"
  );

  return createConfig(await getNestedConfigs(), {
    "mock-api": ENABLE_MOCK_API_MIDDLEWARE,
  });
}
