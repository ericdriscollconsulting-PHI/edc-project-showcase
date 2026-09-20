import assert from 'node:assert/strict';
import test from 'node:test';
import { loadExample } from '../examples/report-architect/demo.mjs';
import { bindTenant } from '../examples/report-architect/src/bind-tenant.ts';
import { buildCloudabilityQueryPlan } from '../examples/report-architect/src/build-cloudability-query.ts';
import { computePackageHash, hashText, renderCanonicalJson, verifyPackageIntegrity }
  from '../examples/report-architect/src/package-integrity.ts';

const example = await loadExample();
const expectedId = 'int-executive-cloud-overspend-001';

test('copied six-file fixture passes integrity and interview identity checks', () => {
  assert.equal(verifyPackageIntegrity(example.files, expectedId).contractId, example.contract.contractId);
});

test('changing any package file invalidates the package', () => {
  for (const name of Object.keys(example.files)) {
    const changed = { ...example.files, [name]: example.files[name] + ' ' };
    assert.throws(() => verifyPackageIntegrity(changed, expectedId), /canonical JSON|recorded artifact hash|recorded package hash/, name);
  }
});

test('recomputed hashes cannot conceal inconsistent contract identity', () => {
  const files = { ...example.files };
  const manifest = JSON.parse(files['cloudability-deployment-manifest.json']);
  manifest.contractId = 'synthetic-other-contract';
  files['cloudability-deployment-manifest.json'] = renderCanonicalJson(manifest);
  const validation = JSON.parse(files['validation-results.json']);
  for (const name of Object.keys(validation.artifactHashes)) validation.artifactHashes[name] = hashText(files[name]);
  validation.packageHash = computePackageHash(validation.artifactHashes, validation);
  files['validation-results.json'] = renderCanonicalJson(validation);
  assert.throws(() => verifyPackageIntegrity(files, expectedId), /contract identity is inconsistent/);
});

test('package rejects a different requested interview and an extra file', () => {
  assert.throws(() => verifyPackageIntegrity(example.files, 'synthetic-other-interview'), /requested interview/);
  assert.throws(() => verifyPackageIntegrity({ ...example.files, 'extra.json': '{}' }), /exact governed file set/);
});

test('selected binder and planner reproduce the source golden query plan', () => {
  const before = JSON.stringify(example);
  const actual = buildCloudabilityQueryPlan(bindTenant(example.contract, example.tenant));
  const manifest = JSON.parse(example.files['cloudability-deployment-manifest.json']);
  assert.deepEqual(actual, manifest.execution.queryPlan);
  assert.equal(JSON.stringify(example), before);
});

test('cost queries retain read-only AWS scope and a distinct date trend', () => {
  const plan = buildCloudabilityQueryPlan(bindTenant(example.contract, example.tenant));
  assert.deepEqual(plan.queries.map(q => q.name), ['current', 'prior-period', 'trend']);
  for (const query of plan.queries) {
    assert.equal(query.method, 'GET');
    assert.equal(query.readOnly, true);
    assert.deepEqual(query.filters, [{ field: 'vendor', comparator: '==', values: ['AWS'] }]);
  }
  assert.deepEqual(plan.queries.find(q => q.name === 'trend').dimensions, ['date']);
});

test('budget and forecast preserve independent manual inputs and alignment', () => {
  const plan = buildCloudabilityQueryPlan(bindTenant(example.contract, example.tenant));
  for (const baseline of ['budget', 'forecast']) {
    const data = plan.comparisonData.find(row => row.source === baseline);
    assert.equal(data.mode, 'manual-reference');
    assert.equal(data.alignmentPolicy, 'aggregate-current-to-baseline-grain');
    assert.ok(data.requiredColumns.includes(`${baseline}-cost`));
  }
});

test('missing provider, date, application, or cost binding stops planning', () => {
  for (const field of ['cloud-provider', 'reporting-period', 'application']) {
    const tenant = structuredClone(example.tenant);
    delete tenant.dimensions[field];
    assert.throws(() => bindTenant(example.contract, tenant), /missing required dimension bindings/);
  }
  const tenant = structuredClone(example.tenant);
  delete tenant.metrics['actual-cost'];
  assert.throws(() => bindTenant(example.contract, tenant), /missing required metric bindings/);
});
