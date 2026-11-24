import { spawn } from 'node:child_process';
import process from 'node:process';

const commands = [
  [
    'node_modules/json-server/lib/cli/bin.js',
    'data/db.json',
    '--host',
    '127.0.0.1',
    '--port',
    '3001',
    '--watch',
  ],
  ['node_modules/.bin/astro', 'dev', '--host', '127.0.0.1', '--ignore-lock'],
];
const processes = commands.map((args) => spawn(process.execPath, args, { stdio: 'inherit' }));
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of processes) child.kill('SIGTERM');
  process.exitCode = code;
}
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => stop());
for (const child of processes) child.on('exit', (code) => stop(code ?? 1));
for (const child of processes)
  child.on('error', (error) => {
    console.error(error);
    stop(1);
  });
