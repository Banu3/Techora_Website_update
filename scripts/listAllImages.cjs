const fs = require('fs');
const path = require('path');

function list(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) list(p);
    else if (/\.(webp|jpg|jpeg|png)$/i.test(f.name)) {
      const stats = fs.statSync(p);
      console.log(p.replace(/\\/g, '/'), stats.size);
    }
  }
}

list('public');
