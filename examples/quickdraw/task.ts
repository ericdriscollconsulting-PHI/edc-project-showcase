/** Narrow showcase interface: only fields consumed by quickdrawWork.
 * The working application owns schema validation and persistence. */
export interface Task {
  id: string;
  title: string;
  domain: 'work' | 'personal';
  kind: 'task' | 'event' | 'note';
  sample: boolean;
  status: 'planned' | 'ready' | 'done';
  priority: 'high' | 'normal' | 'low';
  dueOn: string;
  context: string;
  expected: string;
  outcome: string;
}
