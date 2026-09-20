# Eric Driscoll | Enterprise AI, FinOps & Product Architecture

I turn recurring enterprise problems into practical products: define the decision, design the workflow, connect the data, and establish how the business will measure value.

My work combines client-facing advisory, cloud economics, systems architecture, and product development. These projects show how I translate that experience into inspectable technical work. I own the problem framing, product requirements, architecture decisions, and acceptance criteria, using AI-assisted implementation and testing.

## Start here

| Project | Business problem | What to review |
|---|---|---|
| **FinOps Report Architect** | Repeated discovery and report revisions consume consultant and client labor while obscuring the decision a report should support. | [Case study](case-studies/report-architect.md) · [Query planner](examples/report-architect/src/build-cloudability-query.ts) · [Synthetic report package](examples/report-architect/fixtures/output-package/report-rationale.md) |
| **QUICKDRAW** | AI capacity, task priority, and permission to act are different things. Teams need a useful next action and a clear handoff. | [Case study](case-studies/quickdraw.md) · [Preparation logic](examples/quickdraw/quickdraw-work.ts) |
| **Governed AI Workflow Orchestration** | Manual task handoffs, uncertain execution, and repeated approvals can consume the capacity AI is meant to release. | [Case study and architecture](case-studies/governed-ai-orchestration.md) · [Sanitized execution record](evidence/governed-ai-execution-summary.json) |

**The common thread:** reduce repeated human effort, make decisions explicit, and evaluate the economics of an accepted outcome—including review and rework.

## Run the selected examples

Requires **Node.js 24.x**. No package installation, credentials, or external services are required.

```bash
node --test tests/*.test.mjs
node examples/report-architect/demo.mjs
node examples/quickdraw/demo.mjs
```

The Report Architect example verifies a six-file synthetic package and recreates its read-query plan using selected modules from the working project. The QUICKDRAW example classifies synthetic work into preparation, handoff, and review states. Neither example executes a client query or dispatches work.

## Evidence and scope

This repository is a curated technical portfolio with selected source, synthetic data, focused tests, and a sanitized summary of observed internal AI workflow runs. Report Architect's current product scope is executive AWS cost reporting. QUICKDRAW's included code is a preparation component; connected capacity routing remains product direction. The orchestration case study records a demonstrated internal draft-delivery milestone through September 19, 2026. Client adoption and measured savings are not asserted here.

See [evidence and provenance](EVIDENCE.md) for source boundaries and [verification](VERIFICATION.md) for the checks run on this package.
