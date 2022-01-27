import { readdir } from 'fs/promises';

export function isString(value) {
  return typeof value === "string";
}

export function isFunction(value) {
  return typeof value === "function";
}

export function createFindPlugin({ plugins }) {
  return (name) => plugins.find((plugin) => plugin.constructor.name === name);
}

export function getNodeTargetRules(config) {
  const imgTest = /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/;
  const svgTest = /\.(svg)(\?.*)?$/;
  const mediaTest = /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/;
  const tsTest = /\.tsx?$/;
  const jsTest = /\.m?jsx?$/;

  const permittedRules = [jsTest, tsTest, imgTest, svgTest, mediaTest].map((test) => String(test));

  return [
    {
      oneOf: [
        ...config.module.rules.filter((rule) => permittedRules.includes(String(rule.test))),
        // `null-loader` will make sure to ignore any accidental imports to e.g. `.css` files
        {
          exclude: [/\.(js|mjs|ts)$/, /\.html$/, /\.json$/],
          use: 'null-loader',
        },
      ],
    },
  ];
}

export class Recursive {
  static async readdir(dir) {
    const files = await readdir(dir, { withFileTypes: true });
    const finalFiles = [];

    for (const file of files) {
      if (file.isFile()) finalFiles.push(file.name);
      else if (file.isDirectory()) {
        // sub files come in relative to `file.name`
        const subFiles = await Recursive.readdir(join(dir, file.name));
        // we have to prepend the `file.name` so the path is always relative to `dir`
        finalFiles.push(...subFiles.map((filename) => join(file.name, filename)));
      }
    }

    return finalFiles;
  }
}

