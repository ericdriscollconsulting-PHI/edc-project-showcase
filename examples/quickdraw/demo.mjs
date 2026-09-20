import { quickdrawWork } from './quickdraw-work.ts';

export const task = patch => ({
  id: 'synthetic-task', title: 'Synthetic work item', domain: 'work', kind: 'task',
  sample: false, status: 'planned', priority: 'normal', dueOn: '',
  context: '', expected: '', outcome: '', ...patch
});

// Synthetic records representing ordinary work; sample=false exercises inclusion.
export const tasks = [
  task({ id: 'scope', title: 'Define the acceptance criteria', priority: 'high' }),
  task({ id: 'brief', title: 'Prepare a report design', status: 'ready',
    context: 'Use the synthetic executive reporting requirements.',
    expected: 'A report contract and explicit unresolved dependencies.' }),
  task({ id: 'review', title: 'Review a returned design', priority: 'low',
    outcome: 'Synthetic draft awaiting review.' })
];

if (import.meta.main) {
  const result = quickdrawWork(tasks);
  console.log(JSON.stringify({
    demonstration: 'Synthetic preparation view; no dispatch',
    dispatchAuthorized: result.dispatchAuthorized,
    next: result.next,
    waiting: result.waiting
  }, null, 2));
}
