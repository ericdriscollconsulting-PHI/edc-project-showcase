# Evidence and provenance

Prepared September 20, 2026. This showcase is a snapshot, not a maintained distribution of the complete applications.

## Selected working source

Report Architect material comes from the private working project's main-branch revision resolved on the preparation date. QUICKDRAW's preparation function comes from the EDC control plane. The source blob identities below allow the owner to trace each selection without granting access to either working repository.

| Showcase file | Original path | Git blob SHA-1 |
|---|---|---|
| [examples/report-architect/src/types.ts](examples/report-architect/src/types.ts) | `finops-report-architect/src/types.ts` | `10aac40298cb00f021b6e2e08b3707fd6e0566eb` |
| [examples/report-architect/src/output-file-names.ts](examples/report-architect/src/output-file-names.ts) | `finops-report-architect/src/output-file-names.ts` | `aea0e4ea79a853f1855155b15facc20392784983` |
| [examples/report-architect/src/bind-tenant.ts](examples/report-architect/src/bind-tenant.ts) | `finops-report-architect/src/bind-tenant.ts` | `a467cd3e32ec07b00cc1a3717f3de1c60af6584c` |
| [examples/report-architect/src/build-cloudability-query.ts](examples/report-architect/src/build-cloudability-query.ts) | `finops-report-architect/src/build-cloudability-query.ts` | `235a14d4c0cdbaebf2e7747a3336c4c3b6a64f1e` |
| [examples/report-architect/src/package-integrity.ts](examples/report-architect/src/package-integrity.ts) | `finops-report-architect/src/package-integrity.ts` | `25d3707876d688f7e9d14277262432036f4b1fec` |
| [examples/report-architect/fixtures/output-package/report-contract.json](examples/report-architect/fixtures/output-package/report-contract.json) | `finops-report-architect/fixtures/goldens/output-package/report-contract.json` | `d2af08ab3f099a0a74053ca30102358604db708e` |
| [examples/report-architect/fixtures/output-package/cloudability-deployment-manifest.json](examples/report-architect/fixtures/output-package/cloudability-deployment-manifest.json) | `finops-report-architect/fixtures/goldens/output-package/cloudability-deployment-manifest.json` | `9f1546b02a4a3ae9372f8b98223cd3dfbab77ba0` |
| [examples/report-architect/fixtures/output-package/interview-trace.json](examples/report-architect/fixtures/output-package/interview-trace.json) | `finops-report-architect/fixtures/goldens/output-package/interview-trace.json` | `1e988cf1ce0875844af145a79f8785689481ab41` |
| [examples/report-architect/fixtures/output-package/manual-build-guide.md](examples/report-architect/fixtures/output-package/manual-build-guide.md) | `finops-report-architect/fixtures/goldens/output-package/manual-build-guide.md` | `77131161a6211cb838d8ff17db480af14072aac6` |
| [examples/report-architect/fixtures/output-package/report-rationale.md](examples/report-architect/fixtures/output-package/report-rationale.md) | `finops-report-architect/fixtures/goldens/output-package/report-rationale.md` | `7e8651703eb0976ba1763c108bc0153d8aee90d8` |
| [examples/report-architect/fixtures/output-package/validation-results.json](examples/report-architect/fixtures/output-package/validation-results.json) | `finops-report-architect/fixtures/goldens/output-package/validation-results.json` | `9cd2c0b0c56c12bae9e40127a25abd28f5ff77b1` |
| [examples/report-architect/fixtures/synthetic-tenant.json](examples/report-architect/fixtures/synthetic-tenant.json) | `finops-report-architect/fixtures/tenants/synthetic-tenant.json` | `2352c752f1120e9d6174bd021b20ce2619ada667` |
| [examples/quickdraw/quickdraw-work.ts](examples/quickdraw/quickdraw-work.ts) | `edc-control-plane/lib/quickdraw-work.ts` | `21a3c4150f6b38cf86f7c6949ec9a43a62d58b95` |

The Report Architect selections are copied unchanged, including the synthetic output package. QUICKDRAW changes only its type-only import to a local minimal interface; its runtime function is unchanged. The showcase demos, tests, case studies, and minimal Task interface were prepared for this portfolio. The QUICKDRAW tests adapt the source project's preparation scenarios and omit database and UI coverage.

## Claim boundaries

- The synthetic report package is generated project evidence, not a client deployment or a savings measurement.
- The showcased binder and planner consume a valid report contract. Contract validation, conditional intake, and rendering belong to the full project; they are not included in this runnable subset.
- Package hashes detect internal changes and mixed identities. They do not establish author authenticity against an attacker who can rewrite and consistently reseal an entire package.
- QUICKDRAW's source establishes task preparation behavior. Connected-signal collection, allowance-aware routing, and automatic execution are outside the demonstration. The case study's routing direction reflects the product-direction document updated September 17, 2026.
- Local test results apply to this curated package only. No tenant, customer trial, hosted service, or production deployment was tested while preparing it.

## Publication boundary

The package contains selected source and synthetic fixtures. It excludes private repository history, credentials, client records, household records, runtime logs, and deployment configuration. No permission or link into a working repository is needed to run the examples.
