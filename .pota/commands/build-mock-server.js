import { resolve, dirname, extname } from "path";
import { mkdir, rm, copyFile } from "fs/promises";
import { exists, Recursive, readPackageJson, writePackageJson } from "@pota/shared/fs";
import { exec } from "child_process";
import * as paths from "@pota/webpack-skeleton/.pota/webpack/paths.js";
import logSymbols from "log-symbols";

export const description = "Builds the '/mocks' into an executable node server.";

export const options = [
  {
    option: "--output",
    description: "The build output directory.",
    default: resolve(paths.user, paths.output, "node"),
  },
];

export const action = async ({ output }) => {
  // delete output directory if it exists
  if (await exists(output)) await rm(output, { recursive: true });

  // prepare fresh output directory
  await mkdir(output, { recursive: true });

  const mocksDir = resolve(paths.user, "mocks");

  // get all files from the "mocks" directory
  const mockDirFiles = await Recursive.readdir(mocksDir);

  // copy over all mock files to the output directory
  for (const file of mockDirFiles) {
    await copy(resolve(mocksDir, file), resolve(output, file));
  }

  const indexFile = resolve(output, "index.ts");

  // copy over "index.ts" file
  await copy(resolve(paths.self, "../monck", "index.ts"), indexFile);

  const tsFiles = [
    indexFile,
    ...mockDirFiles.filter((file) => extname(file) === ".ts").map((file) => resolve(output, file)),
  ];

  // compile all ts files to js
  await command(
    `tsc ${tsFiles.join(" ")} --skipLibCheck --esModuleInterop --allowSyntheticDefaultImports`
  );

  // remove ts files from the output directory
  for (const file of tsFiles) {
    await rm(file);
  }

  const pkg = await readPackageJson(paths.user);

  // create a "package.json" for running
  await writePackageJson(
    {
      name: "monck-server",
      main: "index.js",
      scripts: {
        start: "node index.js",
      },
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
    },
    output
  );

  console.log(logSymbols.success, "Done.");
};

async function copy(src, dst) {
  // create destination directories if they don't exist
  const dir = dirname(dst);
  if (!(await exists(dir))) await mkdir(dir, { recursive: true });

  await copyFile(src, dst);
}

function command(command) {
  return new Promise((resolve, reject) =>
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(stdout || stderr);
    })
  );
}
