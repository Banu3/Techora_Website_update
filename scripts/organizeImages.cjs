const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const imagesDir = path.join(publicDir, 'images');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(full));
    } else {
      results.push({
        path: path.relative(publicDir, full).replace(/\\/g, '/'),
        sizeKb: (stat.size / 1024).toFixed(1),
        name: file
      });
    }
  }
  return results;
}

const allImages = getFiles(imagesDir);
console.log('Total images found:', allImages.length);
console.log(allImages.map(i => `${i.path} (${i.sizeKb} KB)`).join('\n'));
