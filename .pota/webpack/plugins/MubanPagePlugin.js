import { readFile } from "fs/promises";

import requireFromString from "require-from-string";

const NS = "MubanPagePlugin";

function replaceTemplateVars(template, variables = {}) {
  let updatedTemplate = String(template);

  for (const [key, value] of Object.entries(variables)) {
    updatedTemplate = updatedTemplate.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return updatedTemplate;
}

export default class MubanPagePlugin {
  options;
  cache = new WeakMap();

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const { webpack } = compiler;
    const { sources, Compilation } = webpack;

    // Specify the event hook to attach to
    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        { name: NS, stage: Compilation.PROCESS_ASSETS_STAGE_DERIVED },
        async (assets) => {
          const [chunk] = compilation.chunks;
          const [file] = chunk.files;

          const asset = assets[file];

          if (!this.cache.has(asset)) {
            const compilationHash = compilation.hash;

            const publicPath = compilation.getAssetPath(compilation.outputOptions.publicPath, {
              hash: compilationHash,
            });

            try {
              const pageAssets = await this.generatePageAssets(asset.source(), publicPath, sources);

              this.cache.set(asset, pageAssets);
            } catch (error) {
              console.log();
              console.error(`Error settings new page assets:`);
              console.error(error);
            }
          }

          for (const [page, source] of this.cache.get(asset)) {
            assets[page] = source;
          }
        }
      );
    });
  }

  cachedTemplate = undefined;
  async getHtmlTemplate() {
    this.cachedTemplate =
      this.cachedTemplate ?? (await readFile(this.options.template, { encoding: "utf-8" }));
    return this.cachedTemplate;
  }

  async generatePageAssets(contextSource, publicPath, sources) {
    const { pages, appTemplate } = this.getContextModule(contextSource);

    const htmlTemplate = await this.getHtmlTemplate();

    return Object.entries(pages)
      .map(([page, m]) => {
        const asset = `${page}.html`;

        try {
          const pageTemplate = replaceTemplateVars(htmlTemplate, {
            content: appTemplate(m.data()),
            publicPath,
          });

          return [asset, new sources.RawSource(pageTemplate)];
        } catch (error) {
          console.log();
          console.error(`Error occurred processing "${asset}":`);
          console.error(error);
          return null;
        }
      })
      .filter(Boolean);
  }

  getContextModule(source) {
    const fallback = { pages: {}, appTemplate: () => "" };

    try {
      return { ...fallback, ...requireFromString(source) };
    } catch (error) {
      console.log();
      console.error(`Error occurred loading "${file}"`);
      console.error(error);

      return fallback;
    }
  }
}
