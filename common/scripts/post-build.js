const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..', '..');
const outputDir = path.join(rootDir, 'dist');
const packageDir = path.join(rootDir, 'packages');

if (fs.existsSync(outputDir)) {
  fs.rmdirSync(outputDir);
}

fs.mkdirSync(outputDir);
fs.cpSync(path.join(packageDir, 'electric-pc', 'dist'), outputDir, { recursive: true });
fs.cpSync(path.join(packageDir, 'electric-mobile', 'dist'), path.join(outputDir, 'mobile'), { recursive: true });
