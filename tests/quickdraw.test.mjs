import assert from 'node:assert/strict';
import test from 'node:test';
import { quickdrawWork } from '../examples/quickdraw/quickdraw-work.ts';
import { task, tasks } from '../examples/quickdraw/demo.mjs';

test('preparation view excludes out-of-scope and completed records without mutation', () => {
  const records = [task({ id: 'work' }), task({ domain: 'personal' }), task({ sample: true }),
    task({ status: 'done' }), task({ kind: 'event' }), task({ kind: 'note' })];
  const before = JSON.stringify(records);
  const result = quickdrawWork(records);
  assert.equal(result.total, 1);
  assert.equal(result.next.task.id, 'work');
  assert.equal(JSON.stringify(records), before);
});

test('priority precedes due date with stable ID tie-breaking', () => {
  const records = [task({ id: 'c', priority: 'normal', dueOn: '2026-09-01' }),
    task({ id: 'b', priority: 'high', dueOn: '2026-09-20' }),
    task({ id: 'a', priority: 'high', dueOn: '2026-09-20' })];
  for (const input of [records, [...records].reverse()]) {
    const result = quickdrawWork(input);
    assert.deepEqual([result.next, ...result.waiting].map(row => row.task.id), ['a', 'b', 'c']);
    assert.equal(result.dispatchAuthorized, false);
  }
});

test('ready status does not bypass missing context or expected result', () => {
  for (const patch of [{ context: 'Sources' }, { expected: 'Draft' }, {}]) {
    const result = quickdrawWork([task({ status: 'ready', ...patch })]);
    assert.equal(result.next.action, 'Prepare task');
    assert.equal(result.next.openBrief, false);
  }
});

test('preparation, handoff, and returned results remain distinct', () => {
  const result = quickdrawWork(tasks);
  assert.equal(result.next.task.id, 'scope');
  assert.deepEqual(result.waiting.map(row => row.action), ['Open brief', 'Review result']);
  assert.equal(new Set([result.next, ...result.waiting].map(row => row.task.id)).size, result.total);
  const reviewed = quickdrawWork([task({ outcome: 'Returned draft' })]);
  assert.equal(reviewed.next, null);
  assert.equal(reviewed.waiting[0].action, 'Review result');
});

test('unconfirmed snapshots suppress recommendations and execution authority', () => {
  assert.deepEqual(quickdrawWork(tasks, false), {
    confirmed: false, dispatchAuthorized: false, next: null, waiting: [], total: 0
  });
});
