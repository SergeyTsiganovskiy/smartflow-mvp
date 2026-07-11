import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const sourceDir = path.join(root, 'AppsScript');
const files = fs.readdirSync(sourceDir)
  .filter((name) => name.endsWith('.gs'))
  .sort();

const errors = [];
const functions = new Map();
const usedMessageKeys = new Set();
let constantsSource = '';

for (const file of files) {
  const fullPath = path.join(sourceDir, file);
  const source = fs.readFileSync(fullPath, 'utf8');

  try {
    new vm.Script(source, { filename: file });
  } catch (error) {
    errors.push(`Syntax error in ${file}: ${error.message}`);
  }

  for (const match of source.matchAll(/^function\s+([A-Za-z0-9_]+)\s*\(/gm)) {
    const name = match[1];
    const locations = functions.get(name) || [];
    locations.push(file);
    functions.set(name, locations);
  }

  for (const match of source.matchAll(/MESSAGE_KEYS\.([A-Z][A-Z0-9_]*)/g)) {
    usedMessageKeys.add(match[1]);
  }

  if (/\bOwnerTelegramId\b|\bnotifyOwner|\bbuildOwner/.test(source)) {
    errors.push(`Legacy Owner runtime reference in ${file}`);
  }

  if (file === 'Constants.gs') {
    constantsSource = source;
  }
}

for (const [name, locations] of functions) {
  if (locations.length > 1) {
    errors.push(`Duplicate global function ${name}: ${locations.join(', ')}`);
  }
}

const definedMessageKeys = new Set(
  [...constantsSource.matchAll(/^\s+([A-Z][A-Z0-9_]+):/gm)]
    .map((match) => match[1])
);

for (const key of [...usedMessageKeys].sort()) {
  if (!definedMessageKeys.has(key)) {
    errors.push(`Undefined MESSAGE_KEYS.${key}`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(
  `Validation passed: ${files.length} files, ` +
  `${functions.size} global functions, ${usedMessageKeys.size} message keys.`
);
