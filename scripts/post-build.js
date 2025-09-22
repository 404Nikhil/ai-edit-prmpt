const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const oldDir = path.join(distDir, '_next');
const newDir = path.join(distDir, 'next');

fs.rename(oldDir, newDir, (err) => {
  if (err) {
    console.error('Error renaming directory:', err);
    return;
  }
  console.log('Successfully renamed _next to next.');

  replaceInDir(distDir, '/_next/', '/next/');
});

// Recursive function to find and replace in all files
function replaceInDir(dir, find, replace) {
  fs.readdir(dir, (err, files) => {
    if (err) return;
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => {
        if (err) return;
        if (stat.isDirectory()) {
          replaceInDir(filePath, find, replace);
        } else if (/\.(html|css|js)$/.test(filePath)) {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) return;
            const result = data.replace(new RegExp(find, 'g'), replace);
            fs.writeFile(filePath, result, 'utf8', (err) => {
              if (err) console.error('Error writing file:', err);
            });
          });
        }
      });
    });
  });
}