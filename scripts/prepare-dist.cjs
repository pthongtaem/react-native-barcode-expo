const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const manifest = {};
for (const key of ['name', 'version', 'description', 'repository', 'license', 'author', 'type', 'dependencies', 'peerDependencies']) {
  manifest[key] = pkg[key];
}
for (const key of ['main', 'module', 'types']) {
  manifest[key] = path.posix.relative('dist', pkg[key]);
}
fs.writeFileSync(path.join(root, 'dist/package.json'), JSON.stringify(manifest, null, 2) + '\n');

// Preserve the existing CommonJS API: require(package) returns the component.
fs.writeFileSync(path.join(root, 'dist/index.cjs'), "module.exports = require('./commonjs/index.js').default;\n");
