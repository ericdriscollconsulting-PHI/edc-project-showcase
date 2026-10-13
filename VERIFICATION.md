# Verification

## Demo runtime floor and subprocess coverage

Verified locally on September 30, 2026 with Node.js **24.2.0**, the documented minimum (`>=24.2 <25`). Official Linux x64 Node distributions were checked against their published SHA-256 sums.

| Check | Result |
|---|---|
| `npm run test` | 15 passed; 0 failed (13 existing behavior tests plus 2 CLI smoke tests) |
| `node examples/report-architect/demo.mjs` | Exit 0; nonempty JSON with verified package identity and three read-only GET queries |
| `node examples/quickdraw/demo.mjs` | Exit 0; nonempty JSON with `dispatchAuthorized: false` |
| Node 24.0.0 negative control: `node --test tests/demos.test.mjs` | Both tests failed on empty stdout despite exit 0, reproducing the `import.meta.main` entry-point gap |
| Node 24.2.0: `node --test tests/demos.test.mjs` | Both tests passed |

The smoke tests launch the real entry points using `process.execPath`, parse stdout as JSON, and enforce these output invariants without dependencies or network calls. Node 24.2.0 emits an experimental type-stripping warning on stderr; stdout remains valid JSON. Node strips TypeScript syntax, but these checks do **not** perform static type checking. No compiler or linter was added, and selected upstream source and existing behavior tests are unchanged.

## Original selected-example verification

Verified locally on September 20, 2026 with Node.js 24.19.0.

| Check | Result |
|---|---|
| Focused behavior tests | 13 passed; 0 failed |
| Report Architect demo | Completed; six-file integrity verified and query plan produced |
| QUICKDRAW demo | Completed; preparation, handoff, and review states produced |
| Selected source provenance | All 13 source/fixture files match recorded Git blob identities, allowing the documented type-only import change |
| Sensitive content review | Selected code and synthetic fixtures reviewed; common credential-pattern scan found no matches |

The behavior tests exercise file mutation, cross-contract substitution, wrong-interview requests, exact package membership, golden query-plan reproduction, AWS scope, baseline separation, missing bindings, work filtering, deterministic ordering, incomplete briefs, result review, and unconfirmed state.

The examples run without dependencies, credentials, or network access. These results cover the selected source and showcase harness, not the complete applications, client environments, UI, or deployment infrastructure. A pattern scan is supporting evidence rather than a guarantee of secret detection.

## Orchestration case-study addition

This documentation-only addition was checked against the two internal completion reports and the September 19 closeout. The JSON summary was parsed and its token totals, three single submissions, zero retries, and pending acceptance were reconciled to those records. Relative links and public-content boundaries were checked. The technical diagram describes the demonstrated draft-delivery path.

No runtime code changed, no new model execution was requested, and no new host test was performed. The 13-test result above applies to the original runnable examples; it is not an orchestration acceptance result. Human intervention estimates and unavailable financial telemetry retain their original qualifications.
