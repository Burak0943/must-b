const fs = require('fs');
let code = fs.readFileSync('src/pages/DocsPage.tsx', 'utf8');

const rx = /<div className="mb-12">[\s\S]*?<strong>License:<\/strong> MIT © 2026 Must-b Inc\. All rights reserved\.[\s\S]*?<\/div>/;
const match = code.match(rx);
if (!match) {
  console.log('no match');
  process.exit(1);
}

const block = match[0];
code = code.replace(rx, '');

const injectTarget = '<div className="flex items-center gap-4 mb-8 pb-8 border-b border-[#1f2937]">';
code = code.replace(injectTarget, `{activeDoc === "Introduction" && (\n          ${block}\n        )}\n        ${injectTarget}`);

fs.writeFileSync('src/pages/DocsPage.tsx', code);
console.log('Fixed DocsPage.tsx');
