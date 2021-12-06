import { readFile } from "fs/promises";
import requireFromString from "require-from-string";

const NS = "MubanPagePlugin";

let cachedTemplate;

async function getHTMLTemplate(path) {
  cachedTemplate = cachedTemplate ?? (await readFile(path, { encoding: "utf-8" }));
  return cachedTemplate;
}

function replaceTemplateVars(template, variables = {}) {
  let updatedTemplate = String(template);

  for (const [key, value] of Object.entries(variables)) {
    updatedTemplate = updatedTemplate.replace(new RegExp(`{{${key}}}`, "g"), value);
  }

  return updatedTemplate;
}

export default class MubanPagePlugin {
  options;

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
        async () => {
          const [chunk] = compilation.chunks;
          const [file] = chunk.files;

          const source = compilation.getAsset(file).source.source();

          let module;

          try {
            module = requireFromString(source);
          } catch (error) {
            console.log();
            console.error(`Error occurred loading "${file}"`);
            console.error(error);
            return; // bail
          }

          const { pages = {}, appTemplate = () => "" } = module ?? {};

          const compilationHash = compilation.hash;

          const publicPath = compilation.getAssetPath(compilation.outputOptions.publicPath, {
            hash: compilationHash,
          });

          const htmlTemplate = await getHTMLTemplate(this.options.template);

          for (const [page, pageModule] of Object.entries(pages)) {
            if (!pageModule || !("data" in pageModule)) continue;

            const asset = `${page}.html`;

            try {
              const pageTemplate = replaceTemplateVars(htmlTemplate, {
                content: appTemplate(pageModule.data()),
                publicPath,
              });

              compilation.emitAsset(`${page}.html`, new sources.RawSource(pageTemplate));
            } catch (error) {
              console.log();
              console.error(`Error occurred emitting "${asset}":`);
              console.error(error);
            }
          }

          compilation.deleteAsset(file);
        }
      );
    });
  }
}
