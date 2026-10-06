# EDC Project Showcase — product one-pager

## What it is, who it serves, and why

A curated technical portfolio of Eric Driscoll's enterprise AI, FinOps, and product architecture work—not a hosted application or a distribution of the full products. It gives prospective clients, collaborators, and technical evaluators a short path from a business problem to inspectable code and evidence. The problem it addresses is evaluating consulting and architecture capability without access to private repositories or client environments.

## Current status and evidence

This is a runnable, dependency-free snapshot with three case studies and two local demonstrations:

- **[FinOps Report Architect](case-studies/report-architect.md):** selected tenant-binding, query-planning, and integrity modules reproduce an executive AWS cost-report plan from a six-file synthetic package. The [demo](examples/report-architect/demo.mjs) does not execute queries; full intake, contract validation, and rendering are outside this subset.
- **[QUICKDRAW](case-studies/quickdraw.md):** the [preparation demo](examples/quickdraw/demo.mjs) separates preparation, user-operated handoff, and returned-result review. It does not dispatch work; connected capacity routing remains product direction.
- **[Governed AI orchestration](case-studies/governed-ai-orchestration.md):** a historical internal draft-delivery milestone through September 19, 2026, backed by a [sanitized execution summary](evidence/governed-ai-execution-summary.json), not a runnable orchestration service. Human acceptance was pending at that checkpoint.

[Verification](VERIFICATION.md) records 13 passing behavior tests and both demo results; the test sources are in [tests/](tests/). [Evidence and provenance](EVIDENCE.md) records source identities and publication boundaries. These establish selected behavior, not production readiness, client adoption, or measured savings. Package hashes check consistency, not author authenticity.

## Run locally

From the repository root, use **Node.js 24.2 or later within 24.x** (the demos use `import.meta.main`; early 24.x releases can exit without demo output). No install, credentials, or external services are needed.

```bash
npm run test
node examples/report-architect/demo.mjs
node examples/quickdraw/demo.mjs
```

Expect 13 passing tests, report JSON with a verified package and read-only query plans, and QUICKDRAW JSON with `dispatchAuthorized: false`. Neither demo sends queries or dispatches tasks.

## Next five milestones — proposed, subject to Eric's acceptance

1. **Make runtime checks reproducible:** align the documented Node floor and package engine range; smoke-test that both demos emit valid JSON. Draft [PR #7](https://github.com/ericdriscollconsulting-PHI/edc-project-showcase/pull/7) proposes this; it is not part of this snapshot.
2. **Guard source provenance:** add a local check against recorded source identities, retaining the documented QUICKDRAW type-import exception. Draft [PR #6](https://github.com/ericdriscollconsulting-PHI/edc-project-showcase/pull/6) proposes this.
3. **Guard orchestration evidence:** test summary totals and pending-acceptance boundaries without rerunning the private workflow. Draft [PR #5](https://github.com/ericdriscollconsulting-PHI/edc-project-showcase/pull/5) proposes this.
4. **Test evaluator usability:** have a fresh reader run the examples and explain each case's demonstrated behavior and exclusions; record friction before expanding the portfolio.
5. **Refresh evidence deliberately:** after owner review, publish a dated snapshot with reconciled checks and source identities; add outcome claims only when supported by accepted, publication-safe evidence.
