import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const branches = ['main', 'demo/inicial', 'demo/resolvida'];
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const files = (branch) =>
  git(
    'ls-tree',
    '-r',
    '--name-only',
    branch,
    '--',
    'src/components',
    'src/layouts',
    'src/scripts',
    'src/lib',
  ).split('\n');
const expected = files('main');
for (const branch of branches) {
  assert.deepEqual(files(branch), expected, `Estrutura diferente em ${branch}`);
}
const allowedDifferences = new Set([
  'src/components/CartFeedback.astro',
  'src/components/PlatformFilter.astro',
  'src/components/SiteHeader.astro',
  'src/scripts/catalogue.ts',
  'src/scripts/platform-filter.ts',
  'src/styles.css',
]);
const changed = git('diff', '--name-only', 'demo/inicial', 'demo/resolvida', '--', 'src')
  .split('\n')
  .filter(Boolean);
assert.deepEqual(
  new Set(changed),
  allowedDifferences,
  'Diferenças inesperadas entre as branches da demonstração',
);
for (const branch of branches) {
  const entry = git('show', `${branch}:src/scripts/store.ts`);
  assert.ok(
    !entry.includes('createElement'),
    `${branch}: construção de interface no inicializador`,
  );
  assert.ok(entry.split('\n').length <= 30, `${branch}: inicializador deixou de ser pequeno`);
}
console.log(
  'As três branches têm a mesma estrutura. As diferenças inicial/resolvida estão limitadas aos seis ficheiros dos cinco exemplos.',
);
