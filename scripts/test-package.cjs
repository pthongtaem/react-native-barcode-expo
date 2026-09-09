const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const example = path.join(root, 'example-expo');
const pkg = require(path.join(root, 'package.json'));
const examplePkg = require(path.join(example, 'package.json'));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'barcode-package-'));
const npmCLI = process.env.npm_execpath;
const hasNpmCLI = npmCLI && path.basename(npmCLI) === 'npm-cli.js';
const run = (command, args, cwd = temp) => execFileSync(command, args, {
  cwd, stdio: 'inherit',
});
const writeJSON = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2));
const runNpm = (args, cwd) => {
  // Invoke npm's JS CLI directly when available: .cmd cannot be execFile'd on Windows.
  assert(process.platform !== 'win32' || hasNpmCLI, 'On Windows, use npm run test:package.');
  return hasNpmCLI ? run(process.execPath, [npmCLI, ...args], cwd) : run('npm', args, cwd);
};

try {
  assert(fs.existsSync(path.join(example, 'node_modules/jest/bin/jest.js')),
    'Install example-expo dependencies before running test:package.');
  // npm pack runs prepack: test the archive that would actually be published.
  runNpm(['pack', '--pack-destination', temp], root);
  const archives = fs.readdirSync(temp).filter(name => name.endsWith('.tgz'));
  assert.equal(archives.length, 1);
  writeJSON(path.join(temp, 'package.json'), { name: 'barcode-package-smoke', private: true });
  runNpm(['install', path.join(temp, archives[0]), '--ignore-scripts',
    '--legacy-peer-deps', '--no-audit', '--no-fund', '--package-lock=false']);

  const modules = path.join(temp, 'node_modules');
  const installed = path.join(modules, pkg.name);
  assert(!fs.lstatSync(installed).isSymbolicLink(), 'Test a tarball install, not a workspace link.');
  const manifest = JSON.parse(fs.readFileSync(path.join(installed, 'package.json'), 'utf8'));
  assert.equal(manifest.version, pkg.version);
  for (const field of ['main', 'module', 'react-native', 'types']) {
    assert(manifest[field], `Missing ${field} entry`);
    assert(fs.statSync(path.join(installed, manifest[field])).isFile(), `Missing ${field} file`);
  }
  assert(fs.existsSync(path.join(installed, 'README.md')));
  assert(fs.existsSync(path.join(installed, 'LICENSE')));

  // Reuse the example's installed peer dependencies and test tools. The package
  // under test and its production dependencies come from npm install above.
  for (const entry of fs.readdirSync(path.join(example, 'node_modules'))) {
    if (entry.startsWith('.') || entry === pkg.name || fs.existsSync(path.join(modules, entry))) continue;
    const source = path.join(example, 'node_modules', entry);
    const target = path.join(modules, entry);
    if (entry.startsWith('@')) {
      fs.mkdirSync(target, { recursive: true });
      for (const child of fs.readdirSync(source)) {
        fs.symlinkSync(path.join(source, child), path.join(target, child), 'junction');
      }
    } else {
      fs.symlinkSync(source, target, 'junction');
    }
  }
  if (!fs.existsSync(path.join(modules, '@types/react'))) {
    fs.mkdirSync(path.join(modules, '@types'), { recursive: true });
    fs.symlinkSync(path.join(root, 'node_modules/@types/react'), path.join(modules, '@types/react'), 'junction');
  }
  fs.cpSync(path.join(example, '__test__'), path.join(temp, '__test__'), { recursive: true });
  fs.copyFileSync(path.join(example, 'App.js'), path.join(temp, 'App.js'));
  fs.copyFileSync(path.join(example, 'babel.config.js'), path.join(temp, 'babel.config.js'));

  const projects = ['main', 'module', 'react-native'].map(field => ({
    ...examplePkg.jest,
    rootDir: temp,
    displayName: field,
    testMatch: ['<rootDir>/__test__/**/*.test.js'],
    transform: { '^.+\\.[cm]?[jt]sx?$': 'babel-jest' },
    moduleNameMapper: { '^react-native-barcode-expo$': path.join(installed, manifest[field]) },
  }));
  writeJSON(path.join(temp, 'jest.config.json'), { projects });
  run(process.execPath, [path.join(example, 'node_modules/jest/bin/jest.js'),
    '--config', path.join(temp, 'jest.config.json'), '--runInBand', '--no-cache']);

  // Resolve declarations through the installed package name, with no source aliases.
  const types = fs.readFileSync(path.join(root, 'test/types.tsx'), 'utf8')
    .replaceAll("'../src'", `'${pkg.name}'`).replaceAll("'../dist'", `'${pkg.name}'`);
  fs.writeFileSync(path.join(temp, 'types.tsx'), types);
  writeJSON(path.join(temp, 'tsconfig.json'), {
    compilerOptions: { jsx: 'react-native', moduleResolution: 'node', noEmit: true,
      skipLibCheck: true, allowSyntheticDefaultImports: true, lib: ['dom', 'esnext'], types: ['react'] },
    files: ['types.tsx'],
  });
  run(process.execPath, [path.join(root, 'node_modules/typescript/bin/tsc'),
    '--project', path.join(temp, 'tsconfig.json')]);
  console.log(`Package verified: ${pkg.name}@${pkg.version} (CJS, ESM, React Native, types).`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
