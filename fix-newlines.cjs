const fs = require('fs');
let code = fs.readFileSync('src/pages/DocsPage.tsx', 'utf8');
code = code.split('\\n').join('\n');
fs.writeFileSync('src/pages/DocsPage.tsx', code);
console.log('Fixed newlines');
