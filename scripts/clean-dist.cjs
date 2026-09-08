const fs = require('node:fs');
const path = require('node:path');

// dist contains generated build artifacts only.
fs.rmSync(path.resolve(__dirname, '../dist'), { recursive: true, force: true });
