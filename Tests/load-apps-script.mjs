import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');

export function loadAppsScript(files, globals = {}) {
  const context = vm.createContext({
    console,
    Date,
    JSON,
    Math,
    Number,
    Object,
    RegExp,
    String,
    ...globals
  });

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, 'AppsScript', file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }

  return context;
}
