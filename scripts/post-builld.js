const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const oldDir = path.join(distDir, '_next');
const newDir = path.join(distDir, 'next');

//`_next` to `next`
fs.rename(oldDir, newDir, (err) => {
  if (err) {
    console.error('Error renaming directory:', err);
    return;
  }
  console.log('Successfully renamed _next to next.');

  // 2. Find and replace all occurrences in the built files
  replaceInDir(distDir, '/_next/', '/next/');
});

// Recursive function to find and replace in all files
function replaceInDir(dir, find, replace) {
  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('Could not list the directory.', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      fs.stat(filePath, (err, stat) => {
        if (err) {
          console.error('Error stating file.', err);
          return;
        }

        if (stat.isDirectory()) {
          // Recurse into subdirectories
          if (file !== '_next' && file !== 'next') { // Avoid recursing into the folder we're modifying
             replaceInDir(filePath, find, replace);
          }
        } else if (/\.(html|css|js)$/.test(filePath)) {
          // Only process html, css, and js files
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              console.error('Error reading file:', err);
              return;
            }
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