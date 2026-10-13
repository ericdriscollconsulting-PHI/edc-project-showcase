import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const evidence = await readFile(new URL('EVIDENCE.md', root), 'utf8');
const reportFiles = [
  'src/types.ts',
  'src/output-file-names.ts',
  'src/bind-tenant.ts',
  'src/build-cloudability-query.ts',
  'src/package-integrity.ts',
  'fixtures/output-package/report-contract.json',
  'fixtures/output-package/cloudability-deployment-manifest.json',
  'fixtures/output-package/interview-trace.json',
  'fixtures/output-package/manual-build-guide.md',
  'fixtures/output-package/report-rationale.md',
  'fixtures/output-package/validation-results.json',
  'fixtures/synthetic-tenant.json',
].map(path => `examples/report-architect/${path}`);
const quickdrawFile = 'examples/quickdraw/quickdraw-work.ts';

function provenanceRows(markdown) {
  const section = markdown.split('## Selected working source\n')[1]?.split('\n## ')[0];
  assert.ok(section, 'selected source section must exist');
  const lines = section.split('\n').filter(line => line.startsWith('|'));
  assert.equal(lines[0], '| Showcase file | Original path | Git blob SHA-1 |');
  assert.equal(lines[1], '|---|---|---|');
  const rows = lines.slice(2).map(line => {
    const match = /^\| \[([^\]]+)\]\(([^)]+)\) \| `([^`]+)` \| `([a-f0-9]{40})` \|$/.exec(line);
    assert.ok(match, `malformed provenance row: ${line}`);
    assert.equal(match[1], match[2], 'showcase label and link must agree');
    return { path: match[2], hash: match[4] };
  });
  assert.deepEqual(rows.map(row => row.path).sort(), [...reportFiles, quickdrawFile].sort(),
    'provenance must cover exactly the 12 Report Architect files and the QUICKDRAW exception');
  return rows;
}

function assertBlob(bytes, expected, path) {
  const actual = createHash('sha1')
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest('hex');
  assert.equal(actual, expected, `Git blob mismatch: ${path}`);
}

test('all 12 unchanged Report Architect files match the recorded Git blob identities', async () => {
  const rows = provenanceRows(evidence);
  for (const path of reportFiles) {
    const row = rows.find(row => row.path === path);
    assertBlob(await readFile(new URL(path, root)), row.hash, path);
  }
  // QUICKDRAW records its original source hash, not the adapted local bytes.
});

test('provenance rejects an altered in-memory sample without changing the fixture', async () => {
  const row = provenanceRows(evidence).find(row => row.path === reportFiles[0]);
  const bytes = await readFile(new URL(row.path, root));
  assertBlob(bytes, row.hash, row.path);
  const altered = Buffer.from(bytes);
  altered[0] ^= 1;
  assert.throws(() => assertBlob(altered, row.hash, row.path), /Git blob mismatch/);
});

test('provenance coverage rejects missing, duplicate, unexpected, and malformed rows', () => {
  const line = evidence.split('\n').find(line => line.startsWith(`| [${reportFiles[0]}]`));
  for (const replacement of ['', `${line}\n${line}`, line.replaceAll(reportFiles[0], 'examples/unexpected.ts'), line.replace(/`[a-f0-9]{40}`/, '`invalid`')]) {
    assert.throws(() => provenanceRows(evidence.replace(line, replacement)), { code: 'ERR_ASSERTION' });
  }
});
