import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const result = spawnSync(process.execPath, ['--test', 'Tests/*.test.mjs'], {
  cwd: root,
  shell: true,
  stdio: 'inherit'
});

process.exit(result.status ?? 1);
