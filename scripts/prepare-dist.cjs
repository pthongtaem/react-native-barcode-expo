const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const manifest = {};
for (const key of ['name', 'version', 'description', 'repository', 'license', 'author', 'type', 'dependencies', 'peerDependencies']) {
  manifest[key] = pkg[key];
}
manifest.main = 'index.cjs';
manifest.module = 'index.esm.mjs';
manifest.types = 'index.d.ts';
fs.writeFileSync(path.join(root, 'dist/package.json'), JSON.stringify(manifest, null, 2) + '\n');
