import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

function runDemo(name) {
  const entry = fileURLToPath(new URL(`../examples/${name}/demo.mjs`, import.meta.url));
  const result = spawnSync(process.execPath, [entry], {
    encoding: 'utf8',
    timeout: 10_000
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, `${name} failed: ${result.stderr}`);
  assert.ok(result.stdout.trim(), `${name} must emit JSON, not silently exit`);
  return JSON.parse(result.stdout);
}

test('Report Architect CLI emits a verified package and three read-only queries', () => {
  const result = runDemo('report-architect');
  assert.equal(result.verifiedPackage.interviewId, 'int-executive-cloud-overspend-001');
  assert.ok(result.verifiedPackage.contractId);
  assert.match(result.verifiedPackage.packageHash, /^[a-f0-9]{64}$/);
  assert.deepEqual(result.queries.map(query => query.name), ['current', 'prior-period', 'trend']);
  for (const query of result.queries) {
    assert.equal(query.method, 'GET');
    assert.equal(query.readOnly, true);
  }
});

test('QUICKDRAW CLI emits a preparation view without dispatch authorization', () => {
  const result = runDemo('quickdraw');
  assert.equal(result.dispatchAuthorized, false);
});
