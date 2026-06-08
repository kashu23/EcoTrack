const fs = require('fs');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = dir + '/' + f;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.css') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let orig = content;
    content = content.replace(/\btext-green\b/g, 'text-red');
    content = content.replace(/\bbg-green\b/g, 'bg-red');
    content = content.replace(/\bborder-green\b/g, 'border-red');
    content = content.replace(/\bring-green\b/g, 'ring-red');
    content = content.replace(/\bshadow-green\b/g, 'shadow-red');
    content = content.replace(/\btext-green-gradient\b/g, 'text-red-gradient');
    content = content.replace(/\bemerald-/g, 'rose-');
    content = content.replace(/#10b981/gi, '#e11d48'); // green
    content = content.replace(/#22c55e/gi, '#e11d48'); // green 500
    content = content.replace(/#34d399/gi, '#fb7185'); // green 400
    content = content.replace(/#059669/gi, '#be123c'); // green 600
    content = content.replace(/16,\s*185,\s*129/g, '225, 29, 72'); // rgba values for green
    
    // Also, rename class in index.css specifically
    content = content.replace(/\.text-green-gradient/g, '.text-red-gradient');
    
    if (content !== orig) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
