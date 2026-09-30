import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const evidenceUrl = new URL('../evidence/governed-ai-execution-summary.json', import.meta.url);
const evidence = JSON.parse(readFileSync(evidenceUrl, 'utf8'));

function assertEvidence(record) {
  const { runs, totals, economics } = record;
  for (const run of runs) {
    assert.equal(run.total_tokens, run.input_tokens + run.output_tokens, `${run.label}: run total`);
  }
  for (const field of ['input_tokens', 'output_tokens', 'total_tokens',
    'cached_input_tokens_included', 'submissions', 'task_retries']) {
    assert.equal(totals[field], runs.reduce((sum, run) => sum + run[field], 0), `aggregate ${field}`);
  }
  assert.equal(totals.completed_drafts, runs.length, 'completed drafts');
  assert.equal(totals.accepted_outcomes_at_checkpoint,
    runs.filter(run => run.human_accepted_at_checkpoint === true).length, 'accepted flags');
  assert.equal(totals.submissions, 3, 'historical submissions');
  assert.equal(totals.task_retries, 0, 'historical retries');
  assert.equal(totals.accepted_outcomes_at_checkpoint, 0, 'historical acceptance');
  assert.equal(economics.cost_per_accepted_outcome, null, 'unknown cost');
  assert.equal(economics.cost_per_accepted_outcome_status,
    'undefined: zero accepted outcomes at checkpoint', 'undefined cost reason');
}

test('historical evidence reconciles tokens, draft counts and acceptance without double-counting cached input', () => {
  assertEvidence(evidence);
});

test('rejects an inconsistent in-memory run total without changing the historical fixture', () => {
  const altered = structuredClone(evidence);
  altered.runs[0].total_tokens += 1;
  assert.throws(() => assertEvidence(altered), { code: 'ERR_ASSERTION', message: /run total/ });
  assert.deepEqual(JSON.parse(readFileSync(evidenceUrl, 'utf8')), evidence);
});

for (const field of ['input_tokens', 'output_tokens', 'total_tokens',
  'cached_input_tokens_included', 'submissions', 'task_retries',
  'completed_drafts', 'accepted_outcomes_at_checkpoint']) {
  test(`rejects an inconsistent in-memory ${field} aggregate`, () => {
    const altered = structuredClone(evidence);
    altered.totals[field] += 1;
    assert.throws(() => assertEvidence(altered), { code: 'ERR_ASSERTION' });
  });
}

for (const [field, aggregate, value, message] of [
  ['submissions', 'submissions', 2, 'historical submissions'],
  ['task_retries', 'task_retries', 1, 'historical retries'],
  ['human_accepted_at_checkpoint', 'accepted_outcomes_at_checkpoint', true, 'historical acceptance']
]) {
  test(`rejects a reconciled change to ${message}`, () => {
    const altered = structuredClone(evidence);
    altered.runs[0][field] = value;
    altered.totals[aggregate] += 1;
    assert.throws(() => assertEvidence(altered), { code: 'ERR_ASSERTION', message: new RegExp(message) });
  });
}

for (const [field, value, message] of [
  ['cost_per_accepted_outcome', 0, 'unknown cost'],
  ['cost_per_accepted_outcome_status', 'known', 'undefined cost reason']
]) {
  test(`rejects a changed ${field}`, () => {
    const altered = structuredClone(evidence);
    altered.economics[field] = value;
    assert.throws(() => assertEvidence(altered), { code: 'ERR_ASSERTION', message: new RegExp(message) });
  });
}
