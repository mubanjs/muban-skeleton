const NS = "EmitMockMainPlugin";

export default class EmitMockMainPlugin {
  get source() {
    return `
import { createServer } from '@mediamonks/monck';

createServer({ useUnixSocket: true });
  `;
  }

  apply(compiler) {
    const { webpack } = compiler;
    const { Compilation, sources } = webpack;

    compiler.hooks.thisCompilation.tap(NS, (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: NS, stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL },
        (assets) => {
          assets["index.js"] = new sources.RawSource(this.source);
        }
      );
    });
  }
}
