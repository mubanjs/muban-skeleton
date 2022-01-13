import { readFile } from "fs/promises";

import requireFromString from "require-from-string";

import { isString, isFunction } from "../utils.js";

const NS = "MubanPagePlugin";

function stringifyAttributes(attributes) {
  return Object.entries(attributes)
    .map(([key, value]) => `${String(key)}="${String(value)}"`)
    .join(" ");
}

function convertObjectsToTags(objectOrArray, tag) {
  const arr = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];

  switch (tag) {
    case "link":
      return arr.map((attributes) => `<link ${stringifyAttributes(attributes)} />`);
    case "meta":
      return arr.map((attributes) => `<meta ${stringifyAttributes(attributes)} >`);
    default:
      return [];
  }
}

function replaceTemplateVars(template, variables = {}) {
  let updatedTemplate = String(template);

  for (const [key, value] of Object.entries(variables)) {
    updatedTemplate = updatedTemplate.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return updatedTemplate;
}

function replaceTemplateTitle(template, title) {
  return template.replace(/<title>(.*?)<\/title>/, (match, g0) => match.replace(g0, title));
}

function insertHeadTags(template, headTags) {
  const headClosingTagIndex = template.indexOf("</head>");

  const beforeHeadClosingTag = template.slice(0, headClosingTagIndex);
  const afterHeadClosingTag = template.slice(headClosingTagIndex); // includes the head closing tag

  return [beforeHeadClosingTag, ...headTags, afterHeadClosingTag].join("\n");
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

              this.cache = new WeakMap();
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
          let pageTemplate = replaceTemplateVars(htmlTemplate, {
            content: appTemplate(m.data()),
            publicPath,
          });

          if ("title" in m && isString(m.title)) {
            pageTemplate = replaceTemplateTitle(pageTemplate, m.title);
          }

          const newHeadTags = [];

          if ("meta" in m && isFunction(m.meta)) {
            newHeadTags.push(...convertObjectsToTags(m.meta(), "meta"));
          }
          if ("link" in m && isFunction(m.link)) {
            newHeadTags.push(...convertObjectsToTags(m.link(), "link"));
          }

          if (newHeadTags.length > 0) pageTemplate = insertHeadTags(pageTemplate, newHeadTags);

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
      console.error(error);

      return fallback;
    }
  }
}
