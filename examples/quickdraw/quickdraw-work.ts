import type { Task } from "./task.ts";

/** Preparation view of existing task intent, not the node01 admission engine.
 * No database, React, provider, clock or execution side effects. */
export function quickdrawWork(tasks: readonly Task[], confirmed = true) {
  const dispatchAuthorized = false as const;
  if (!confirmed) return { confirmed, dispatchAuthorized, next: null, waiting: [], total: 0 };
  const priority = { high: 0, normal: 1, low: 2 };
  const ordered = tasks.filter(t => t.domain === "work" && t.kind === "task" && !t.sample && t.status !== "done")
    .sort((a, b) => priority[a.priority] - priority[b.priority] || (a.dueOn || "9999").localeCompare(b.dueOn || "9999") || a.id.localeCompare(b.id));
  const rows = ordered.map(task => {
    const missing = [!task.context.trim() && "Add context and source references", !task.expected.trim() && "Define the expected result"].filter(Boolean) as string[];
    const state = task.outcome.trim() ? "review" : missing.length ? "prepare" : task.status === "ready" ? "brief" : "prepare";
    const reason = state === "review" ? "A saved result needs your review." : missing.length ? missing.join(". ") + "." : state === "brief" ? "Brief is ready for a user-operated handoff; execution fit is unverified." : "Context and expected result are recorded. Prepare the brief.";
    const action = state === "review" ? "Review result" : missing.length ? "Prepare task" : state === "brief" ? "Open brief" : "Prepare brief";
    return { task, state, reason, action, openBrief: state === "review" || missing.length === 0 };
  });
  const next = rows.find(row => row.state !== "review") || null;
  return { confirmed, dispatchAuthorized, next, waiting: rows.filter(row => row !== next), total: rows.length };
}
