# Verification

Verified locally on September 20, 2026 with Node.js 24.19.0.

| Check | Result |
|---|---|
| Focused behavior tests | 13 passed; 0 failed |
| Report Architect demo | Completed; six-file integrity verified and query plan produced |
| QUICKDRAW demo | Completed; preparation, handoff, and review states produced |
| Selected source provenance | The 12 unchanged Report Architect source/fixture files match recorded Git blob identities; QUICKDRAW records the original source identity and is excluded from direct local-byte comparison because of its adapted import |
| Sensitive content review | Selected code and synthetic fixtures reviewed; common credential-pattern scan found no matches |

The behavior tests exercise file mutation, cross-contract substitution, wrong-interview requests, exact package membership, golden query-plan reproduction, AWS scope, baseline separation, missing bindings, work filtering, deterministic ordering, incomplete briefs, result review, and unconfirmed state.

The examples run without dependencies, credentials, or network access. These results cover the selected source and showcase harness, not the complete applications, client environments, UI, or deployment infrastructure. A pattern scan is supporting evidence rather than a guarantee of secret detection.

## Repeatable selected-source provenance check

Verified with Node.js 24.19.0: `node --test tests/provenance.test.mjs` passes all three provenance tests; `npm test` passes all 16 tests (the original 13 behavior tests plus three provenance tests).

The new check computes Git blob SHA-1 from raw bytes for each of the 12 unchanged Report Architect entries in EVIDENCE.md. Exact expected table membership prevents silent omissions; negative cases reject missing, duplicate, unexpected, and malformed rows. Flipping one byte of an in-memory source sample was observed to fail with `Git blob mismatch`; the retained regression test asserts that rejection. No copied source or fixture was changed.

QUICKDRAW's table entry is the original source hash. Its adapted local bytes cannot be compared directly without the original import, which is not reconstructed here. No private repository was fetched or independently verified. See EVIDENCE.md for the comparison and authenticity boundaries.

## Orchestration case-study addition

This documentation-only addition was checked against the two internal completion reports and the September 19 closeout. The JSON summary was parsed and its token totals, three single submissions, zero retries, and pending acceptance were reconciled to those records. Relative links and public-content boundaries were checked. The technical diagram describes the demonstrated draft-delivery path.

No runtime code changed, no new model execution was requested, and no new host test was performed. The 13-test result above applies to the original runnable examples; it is not an orchestration acceptance result. Human intervention estimates and unavailable financial telemetry retain their original qualifications.
