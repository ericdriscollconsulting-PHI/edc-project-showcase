# Report Rationale: Executive AWS Cost Exceptions

## Business objectives

- How much amortized AWS cost was incurred in the selected period, and what is driving it?
- How does current amortized AWS cost compare independently with each selected baseline?
- Which AWS cost changes meet the defined materiality rules, and what response is required?
- Which cost center owns the spend and resulting follow-up?

## Persona and decision fit

This design serves an executive or cloud leader making this decision: Approve corrective action for material AWS cost changes. The lead objective is Identify and manage material cost changes; supporting objectives remain visible as separate modules rather than being collapsed into an anomaly-only report.

## Design choices

| Component | Selected value | Why | Source |
|---|---|---|---|
| Objectives | Understand and explain AWS spend, Compare AWS actual spend with budget or forecast, Identify and manage material cost changes, Attribute spend to accountable owners | Determines the conditional modules and business questions | Interview: goals |
| Lead objective | Identify and manage material cost changes | Keeps a multi-purpose report focused on one leading decision | Interview: lead use case |
| Modules | Spend overview, Plan comparison, Cost exceptions, Accountability | Keeps each selected outcome explicit and independently testable | Recipe derivation |
| Comparison | Same elapsed portion of the prior period | Preserves the selected baseline as an independent requirement. | Interview: comparison branch |
| Comparison | Budget from Finance Approved Budget; fiscal month; accountability dimension; USD | Preserves the selected baseline as an independent requirement. | Interview: comparison branch |
| Comparison | Forecast from Cloud Finance Forecast; fiscal year end; as of 2026-08-01; accountability dimension; USD | Preserves the selected baseline as an independent requirement. | Interview: comparison branch |
| Scope | AWS only; Entire organization; lead accountability dimension: cost center | Restricts the MVP to AWS while preserving an organization-wide decision boundary | Interview: organizational scope |
| Accountability | cost center | Provides the leading operating breakdown and names Cloud Cost Owner as the accountable role | Interview: accountability |
| Cost basis | amortized cost | Represents commitment-adjusted cloud economics | Recipe default |
| Presentation | KPI summary cards, Trend line, Baseline comparison chart, Ranked variance chart, Detailed table | Reflects the selected or recommended executive layout | Interview: presentation |
| Delivery | Interactive Cloudability View, PDF or slide-ready summary, JSON specification | Records consumption requirements without claiming automated delivery | Interview: formats |
| Materiality | variance percent &gt;= 10% OR variance amount &gt;= USD 20,000 | Focuses exception review on meaningful changes | Interview: anomaly branch |
| Additional data | requested | Captures sources, safe join keys, grain, refresh cadence, and one accountable owner without claiming an active integration | Interview: additional data |
| Alerts | requested | Captures desired triggers, channels, and recipient roles while keeping configuration manual and write-disabled | Interview: alerts |
| Review cadence | monthly | Establishes a bounded operating rhythm | Interview: cadence |

## Multiple-baseline treatment

Budget, forecast, and prior-period selections remain independent comparison plans. This prevents one baseline from overwriting another and does not assume that one native Cloudability View can perform every comparison.

## Module-specific ranking

Each module has an explicit ranking. Comparison and exception modules rank every baseline independently, preventing a budget or forecast panel from silently inheriting the first baseline's sort.

- Spend overview: actual-cost desc, top 20
- Plan comparison, prior period: prior-period-variance-amount desc, top 20
- Plan comparison, budget: budget-variance-amount desc, top 20
- Plan comparison, forecast: forecast-variance-amount desc, top 20
- Cost exceptions, prior period: prior-period-variance-amount desc, top 20
- Cost exceptions, budget: budget-variance-amount desc, top 20
- Cost exceptions, forecast: forecast-variance-amount desc, top 20
- Accountability: actual-cost desc, top 20

## Additional-source dependency

The report requires cmdb service catalog, business kpi from Enterprise CMDB/service catalog and governed business KPI data product. Combine it using application, reporting period at selected join keys grain. Refresh daily; Enterprise Data Product Owner owns availability and quality.
This is a manual dependency definition, not a configured connector. Safe construction requires source access, join coverage, uniqueness, grain, freshness, and reconciliation evidence; all integration writes remain disabled.

## Alert operating boundary

Alert intent is documented, but configuration remains manual or integration-dependent. The manifest disables alert writes, and the package does not prove an alert exists or was delivered. Material-event repeats use a 24 hours cooldown and resolve only when a disposition is recorded. After 3 days to Cloud Finance Director.

## Readiness boundary

The package is design-ready only. Tenant field validation, read-query execution, source reconciliation, external baseline preparation, additional-source decisions and inputs, and any manual View or alert configuration remain operational steps. Saved-report creation is unverified, View writes are disabled here, and this package has no write authority.

## Assumptions and limitations

- The MVP is restricted to AWS provider data by an explicit cloud-provider filter
- Tenant dimension and metric bindings must be confirmed before query execution or manual construction
- Saved-report creation remains manual until a supported mutation API is verified
- Budget reference data must be supplied and its grain and currency validated before execution
- Forecast reference data must be supplied and its grain and currency validated before execution
- Alert configuration is a manual requirement; this package performs no alert writes or delivery integrations
- Additional data must be supplied and its ownership, grain, join keys, and freshness validated before execution
