const fs = require('fs');

let code = fs.readFileSync('src/pages/DocsPage.tsx', 'utf8');

// 1. Extract the manifesto
const startIdx = code.indexOf('<div className="mb-12">');
const endStr = '<strong>License:</strong> MIT © 2026 Must-b Inc. All rights reserved.\n          </p>\n        </div>';
const endIdx = code.indexOf(endStr) + endStr.length;

if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find the manifesto block in the file!");
    process.exit(1);
}

const manifestoBlock = code.substring(startIdx, endIdx);

// Remove the manifesto from its current position
code = code.substring(0, startIdx) + code.substring(endIdx);

// Let's remove any leftover newlines before the blockquote
code = code.replace(/\\n\\s*<blockquote/, '\\n        <blockquote');

// 2. Update SIDEBAR
code = code.replace(
    'items: ["Introduction", "Core Philosophy"],',
    'items: ["README", "Introduction", "Core Philosophy"],'
);

// 3. Add README to DOCS_DATA
const newDocEntry = `  "README": {
    title: "README",
    icon: BookOpen,
    content: (
      <>
        ${manifestoBlock}
      </>
    )
  },
`;

code = code.replace(
    'const DOCS_DATA: Record<string, { title: string; content: React.ReactNode; icon: any }> = {\\n',
    'const DOCS_DATA: Record<string, { title: string; content: React.ReactNode; icon: any }> = {\\n' + newDocEntry
);

// 4. Update useState
code = code.replace(
    'useState("Introduction")',
    'useState("README")'
);
// In case it has single quotes
code = code.replace(
    "useState('Introduction')",
    'useState("README")'
);

fs.writeFileSync('src/pages/DocsPage.tsx', code);
console.log("DocsPage.tsx updated successfully.");
