const CSS_TEST = /\.css$/;
const SCSS_TEST = /\.(scss|sass)$/;

module.exports = {
  core: {
    builder: "webpack5",
  },
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  staticDirs: [{ from: "../static", to: "static" }, "../src/pages/public", "static"],
  async webpackFinal(config) {
    const { getNestedConfigs, createConfig, createFindPlugin } = await import(
      "@pota/webpack-skeleton/.pota/webpack/util.js"
    );

    const [mubanConfig] = await createConfig(await getNestedConfigs());

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
};
