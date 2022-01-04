import * as paths from "@pota/webpack-skeleton/.pota/webpack/paths.js";
import { readPackageJson } from "@pota/shared/fs";

const NS = "EmitPackageJsonPlugin";

export default class EmitPackageJsonPlugin {
  get packageSource() {
    return readPackageJson(paths.user)
      .then((pkg) => ({
        name: "monck-server",
        type: "module",
        main: "main.js",
        scripts: {
          start: "node main.js",
        },
        dependencies: pkg.dependencies,
        devDependencies: pkg.devDependencies,
      }))
      .then((pkg) => JSON.stringify(pkg, null, 2));
  }

  apply(compiler) {
    const { webpack } = compiler;
    const { Compilation, sources } = webpack;

    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        { name: NS, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        async (assets) => {
          assets["package.json"] = new sources.RawSource(await this.packageSource);
        }
      );
    });
  }
}
