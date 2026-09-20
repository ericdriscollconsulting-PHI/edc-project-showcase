import { readFile } from 'node:fs/promises';
import { outputFileNames } from './src/output-file-names.ts';
import { verifyPackageIntegrity } from './src/package-integrity.ts';
import { bindTenant } from './src/bind-tenant.ts';
import { buildCloudabilityQueryPlan } from './src/build-cloudability-query.ts';

export async function loadExample() {
  const entries = await Promise.all(outputFileNames().map(async name => [name,
    await readFile(new URL(`./fixtures/output-package/${name}`, import.meta.url), 'utf8')]));
  const files = Object.fromEntries(entries);
  const tenant = JSON.parse(await readFile(new URL('./fixtures/synthetic-tenant.json', import.meta.url), 'utf8'));
  const contract = JSON.parse(files['report-contract.json']);
  return { files, tenant, contract };
}

if (import.meta.main) {
  const { files, tenant, contract } = await loadExample();
  const identity = verifyPackageIntegrity(files, 'int-executive-cloud-overspend-001');
  const plan = buildCloudabilityQueryPlan(bindTenant(contract, tenant));
  console.log(JSON.stringify({
    demonstration: 'Synthetic report package; no network calls or writes',
    verifiedPackage: identity,
    queries: plan.queries,
    comparisonInputs: plan.comparisonData,
    readiness: JSON.parse(files['validation-results.json']).readiness
  }, null, 2));
}
