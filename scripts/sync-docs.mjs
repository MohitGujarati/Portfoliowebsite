// Refresh the verbatim source appendices in docs/REBUILD.md and docs/DESIGN.md from the real files.
// Run from the repository root: npm run docs:sync
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (path) => readFileSync(join(root, path), 'utf8').replace(/\r\n/g, '\n').trimEnd();
const language = {
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.css': 'css',
  '.json': 'json',
  '.svg': 'svg',
  '.yml': 'yaml',
  '.mjs': 'js',
};

/** Every website source file except the stylesheet, which lives in DESIGN.md. */
function sourceFiles() {
  const tree = ['app', 'components', 'lib'].flatMap((dir) =>
    readdirSync(join(root, 'frontend', dir), { recursive: true })
      .map((file) => `frontend/${dir}/${String(file).replace(/\\/g, '/')}`)
      .filter((file) => /\.(tsx?|svg)$/.test(file)),
  );
  const config = ['package.json', 'next.config.ts', 'tsconfig.json', 'vercel.json', '.env.example'].map(
    (file) => `frontend/${file}`,
  );
  return [...config, ...tree.sort(), '.github/workflows/deploy.yml'];
}

// Four-backtick fences, so source that contains ``` cannot end a block early.
const block = (path) => `### \`${path}\`\n\n\`\`\`\`${language[extname(path)] ?? ''}\n${read(path)}\n\`\`\`\`\n`;

function replaceBetween(doc, marker, body) {
  const path = join(root, 'docs', doc);
  const text = readFileSync(path, 'utf8');
  const start = `<!-- ${marker}:start -->`;
  const end = `<!-- ${marker}:end -->`;
  const from = text.indexOf(start);
  const to = text.indexOf(end);
  if (from < 0 || to < from) throw new Error(`${doc} is missing the ${marker} markers`);
  writeFileSync(path, `${text.slice(0, from + start.length)}\n\n${body}\n${text.slice(to)}`);
}

const files = sourceFiles();
replaceBetween('REBUILD.md', 'source-files', files.map(block).join('\n'));
replaceBetween('DESIGN.md', 'stylesheet', block('frontend/app/globals.css'));
console.log(`docs synced: ${files.length} source files in REBUILD.md, stylesheet in DESIGN.md`);
