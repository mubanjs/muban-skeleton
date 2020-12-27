import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import shell from 'shelljs';

import { paths } from '../../config/paths';

// clean up
shell.rm('-rf', paths.distMockNodePath);
// prepare folders
shell.mkdir('-p', paths.distMockNodePath);

// copy over mocks
shell.cp('-r', paths.mockPath, path.resolve(paths.distMockNodePath, './mocks'));
// copy over index file that starts the server
shell.cp(path.resolve(paths.projectDir, './scripts/mocks/index.ts'), path.resolve(paths.distMockNodePath, './index.ts'));

// compile all TS files in place
execSync(`tsc -p ${path.resolve(paths.projectDir, './scripts/mocks/tsconfig.mocks.json')}`);

// remove source TS files
console.log(`rm -rf ${paths.distMockNodePath}/*.ts`);
console.log(`rm -rf ${paths.distMockNodePath}/**/*..ts`);
shell.rm('-rf', paths.distMockNodePath + '/*.ts');
shell.rm('-rf', paths.distMockNodePath + '/**/*.ts');

// generate package.json
const packageJson = require(path.resolve(paths.projectDir, './package.json'));
const content = {
  "name": "mocnk-server",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": packageJson.dependencies,
  "devDependencies": packageJson.devDependencies,
}
fs.writeFileSync(path.resolve(paths.distMockNodePath, './package.json'), JSON.stringify(content, null, 2), 'utf-8');


console.log('done');
