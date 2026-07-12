import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

function extractFunctions(source, origin, result) {
  const normalized = source.replace(/\r\n?/g, '\n');
  const matches = [...normalized.matchAll(/^function\s+([A-Za-z0-9_]+)\s*\(/gm)];

  matches.forEach(function(match) {
    const open = normalized.indexOf('{', match.index);
    let depth = 0;
    let quote = '';
    let escaped = false;
    let end = normalized.length;

    for (let index = open; index < normalized.length; index++) {
      const character = normalized[index];

      if (quote) {
        if (escaped) {
          escaped = false;
        } else if (character === '\\') {
          escaped = true;
        } else if (character === quote) {
          quote = '';
        }
        continue;
      }

      if (character === "'" || character === '"' || character === '`') {
        quote = character;
      } else if (character === '{') {
        depth++;
      } else if (character === '}') {
        depth--;
        if (depth === 0) {
          end = index + 1;
          break;
        }
      }
    }

    const body = normalized
      .slice(match.index, end)
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim();
    result.set(match[1], { body, origin });
  });
}

function loadCurrentFunctions() {
  const result = new Map();
  const directory = path.join(root, 'AppsScript');

  fs.readdirSync(directory)
    .filter((name) => name.endsWith('.gs'))
    .sort()
    .forEach(function(name) {
      extractFunctions(
        fs.readFileSync(path.join(directory, name), 'utf8'),
        name,
        result
      );
    });

  return result;
}

function loadReferenceFunctions(reference) {
  const result = new Map();
  const files = execFileSync(
    'git',
    ['ls-tree', '-r', '--name-only', reference, 'AppsScript'],
    { cwd: root, encoding: 'utf8' }
  ).split(/\r?\n/).filter((name) => name.endsWith('.gs'));

  files.forEach(function(name) {
    const source = execFileSync(
      'git',
      ['show', `${reference}:${name}`],
      { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 }
    );
    extractFunctions(source, `${reference}:${name}`, result);
  });

  return result;
}

const reference = process.argv[2] || 'HEAD';
const before = loadReferenceFunctions(reference);
const after = loadCurrentFunctions();
const errors = [];

for (const [name, item] of before) {
  const current = after.get(name);
  if (!current) {
    errors.push(`Missing function ${name} from ${item.origin}`);
  } else if (current.body !== item.body) {
    errors.push(`Changed function ${name}: ${item.origin} -> ${current.origin}`);
  }
}

for (const [name, item] of after) {
  if (!before.has(name)) {
    errors.push(`Unexpected function ${name} in ${item.origin}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log(`Function move verification passed: ${after.size} functions unchanged.`);
