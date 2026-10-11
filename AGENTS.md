# Agent instructions

This repository is **Tier 1** under [EDC-POL-004](https://github.com/ericdriscollconsulting-PHI/edc-governance/blob/main/policies/EDC-POL-004-agent-operating-policy.md).

Every agent working here (Claude, Codex, Copilot, Cursor, open-weight models, subagents and custom agents) follows, in order:

1. [EDC Working Constitution](https://github.com/ericdriscollconsulting-PHI/edc-governance/blob/main/docs/working-constitution.md)
2. [EDC-POL-004 — Agent Operating Policy](https://github.com/ericdriscollconsulting-PHI/edc-governance/blob/main/policies/EDC-POL-004-agent-operating-policy.md)
3. Every other Approved document on `main` of [edc-governance](https://github.com/ericdriscollconsulting-PHI/edc-governance)

**Governance preflight (required before any work):** confirm you can read `edc-governance` at `main` and record the commit you read. If you cannot, do not start: report "governance unavailable" and the access that is missing. Every PR description carries `Governance: <40-character commit>`; the required check fails without it.

This file points to policy and never restates or extends it. If anything in this repository conflicts with edc-governance `main`, edc-governance wins: stop and report the conflict.

## Repository facts

- Required check: `Showcase check` — run locally with `npm test`
- Product and design references: `PRODUCT.md`, `README.md`, `EVIDENCE.md`, `VERIFICATION.md`, `case-studies/`
- Product scope limits:
  - "not a hosted application or a distribution of the full products" (`PRODUCT.md`)
  - "This showcase is a snapshot, not a maintained distribution of the complete applications." (`EVIDENCE.md`)
  - Publication boundary (`EVIDENCE.md`): "The package contains selected source, synthetic fixtures, and a sanitized summary of internal execution measurements. It excludes private repository history, credentials, client records, household records, raw runtime logs, and deployment configuration."
  - "These establish selected behavior, not production readiness, client adoption, or measured savings." (`PRODUCT.md`)
  - "Neither demo sends queries or dispatches tasks." (`PRODUCT.md`)
