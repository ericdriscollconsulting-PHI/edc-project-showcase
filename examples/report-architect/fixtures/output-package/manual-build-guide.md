# Manual Build Guide: Executive AWS Cost Exceptions

Status: Design-ready; tenant validation of target bindings, external baseline preparation, additional-source preparation and integration validation remain outstanding. Contract: rpt-int-executive-cloud-overspend-001.

This is the current MVP fallback output when automated saved-report creation is unavailable or unverified. It is not proof that a report was built, deployed, executed, or validated in Cloudability.

External baseline data is required before the complete comparison report can be built or previewed.

Additional source data and manual integration validation are required before the complete report can be built or previewed.

## Report purpose

- Selected objectives: Understand and explain AWS spend, Compare AWS actual spend with budget or forecast, Identify and manage material cost changes, Attribute spend to accountable owners
- Lead objective: Identify and manage material cost changes
- Intended decision: Approve corrective action for material AWS cost changes
- Accountable owner role: Cloud Cost Owner
- Review cadence: monthly
- Scope: AWS only; Entire organization; lead accountability dimension: cost center

## Prerequisites

- Confirm access to the intended Cloudability tenant and reporting workspace.
- Confirm every field marked REQUIRES TENANT CONFIRMATION and every UNBOUND placeholder.
- Obtain controlled AWS-only extracts for every selected external budget or forecast baseline.
- Obtain approved access to each named additional source and confirm its accountable data owner.
- Confirm the requested presentation and delivery formats are available or define an approved manual conversion step.
- Do not execute an API, View, alert, or other platform write without separate approval and validated authority.

## Exact design specification

| Component | Required setting |
|---|---|
| Report title | Executive AWS Cost Exceptions |
| Cost basis | amortized cost |
| Current period | month to date |
| Dimensions | cost-center -&gt; REQUIRES TENANT CONFIRMATION \(candidate: synthetic\_business\_mapping\_cost\_center\), application -&gt; REQUIRES TENANT CONFIRMATION \(candidate: synthetic\_business\_mapping\_application\), cloud-provider -&gt; REQUIRES TENANT CONFIRMATION \(candidate: vendor\), reporting-period -&gt; REQUIRES TENANT CONFIRMATION \(candidate: date\) |
| Source metrics | actual-cost -&gt; REQUIRES TENANT CONFIRMATION \(candidate: amortized\_cost\) |
| Derived metrics | prior-period-cost, prior-period-variance-amount, prior-period-variance-percent, budget-cost, budget-variance-amount, budget-variance-percent, forecast-cost, forecast-variance-amount, forecast-variance-percent |
| Filters | cloud-provider == AWS |
| Module rankings | Use the authoritative per-module ranking plan below |
| Row limit | 20 |
| Presentation mode | recommended |
| Visual components | KPI summary cards, Trend line, Baseline comparison chart, Ranked variance chart, Detailed table |
| Delivery formats | Interactive Cloudability View, PDF or slide-ready summary, JSON specification |
| Materiality | variance percent &gt;= 10% OR variance amount &gt;= USD 20,000 |
| Alert requirement | requested |
| Additional data | requested |
| Stopping rule | Close the review cycle when no result meets a materiality threshold, or every material result has one documented owner and disposition. |

## Comparison plan

| Baseline | Requirement |
|---|---|
| Prior period | Same elapsed portion of the prior period |
| Budget | Budget from Finance Approved Budget; fiscal month; accountability dimension; USD |
| Forecast | Forecast from Cloud Finance Forecast; fiscal year end; as of 2026-08-01; accountability dimension; USD |

## Read-query definitions

These are read-only definitions. Successful execution and reconciliation in the target tenant have not been demonstrated by this package.

| Query | Method | Endpoint | Period | Dimensions | Metrics |
|---|---|---|---|---|---|
| current | GET | /v3/reporting/cost/run | month to date | synthetic\_business\_mapping\_cost\_center, synthetic\_business\_mapping\_application, vendor, date | amortized\_cost |
| prior-period | GET | /v3/reporting/cost/run | same elapsed period | synthetic\_business\_mapping\_cost\_center, synthetic\_business\_mapping\_application, vendor, date | amortized\_cost |
| trend | GET | /v3/reporting/cost/run | month to date | date | amortized\_cost |

## Module build plan

| Module | Manual build instruction |
|---|---|
| Spend overview | Summarize current amortized cost and the selected time period; use the chosen lead dimension for drill-down. |
| Plan comparison | Show actual cost beside every selected baseline; keep budget and forecast as separate named series or panels. |
| Cost exceptions | Apply variance percent &gt;= 10% OR variance amount &gt;= USD 20,000 and the selected across-baseline rule before routing an exception. |
| Accountability | Group the result by the lead accountability dimension and show the accountable owner role in the operating instructions. |

## Authoritative module ranking plan

Rank each module independently. Budget, forecast, and prior-period panels must not inherit a single global or first-baseline sort.

| Module | Baseline | Sort field | Direction | Limit |
|---|---|---|---|---|
| Spend overview | Not applicable | actual-cost | desc | 20 |
| Plan comparison | prior period | prior-period-variance-amount | desc | 20 |
| Plan comparison | budget | budget-variance-amount | desc | 20 |
| Plan comparison | forecast | forecast-variance-amount | desc | 20 |
| Cost exceptions | prior period | prior-period-variance-amount | desc | 20 |
| Cost exceptions | budget | budget-variance-amount | desc | 20 |
| Cost exceptions | forecast | forecast-variance-amount | desc | 20 |
| Accountability | Not applicable | actual-cost | desc | 20 |

## Construction steps

1. Confirm the target Cloudability tenant, reporting access, and the approved operating workspace.
2. Validate every candidate dimension, metric, and filter binding shown below; replace each UNBOUND value before execution.
3. Confirm the bound provider field uses the exact literal AWS in the target tenant, then prove the generated provider filter excludes every non-AWS row.
4. Create the current-cost read definition using GET /v3/reporting/cost/run. Treat the request parameters as a design until it succeeds and reconciles in the target tenant.
5. Create the prior-period read definition using GET /v3/reporting/cost/run and align it using the selected prior-period mode.
6. Create the dedicated trend read definition using GET /v3/reporting/cost/run and group it by the tenant-bound reporting-period dimension.
7. Prepare each budget or forecast input through the External baseline data workflow. Do not present external data as a native Cloudability comparison unless that capability is separately validated.
8. Prepare and validate every additional source through the Additional data dependencies workflow before combining it with cloud cost data.
9. Reconcile current cost, and any prior-period query result, to an authoritative Cloudability total before deriving variance.
10. Build the modules in the specified order and apply the requested presentation components and delivery formats.
11. Apply the materiality and across-baseline rules only after every selected comparison is aligned to a valid common grain.
12. Complete the separate manual Alert setup; generating this package does not activate an alert.
13. Complete the verification checklist and record evidence for bindings, totals, comparison inputs, and calculation examples.
14. Save or share a View only through the tenant's approved change process. Saved-report creation remains unverified, View writes are disabled here, and this package performs no write.

## External baseline data workflow

External baseline data is required for budget and forecast comparisons in this MVP. The package does not claim a native Cloudability baseline join. Complete each workflow in an approved companion analysis or another tenant-validated method.

### Budget baseline

- Source reference: Finance Approved Budget
- Reference detail: fiscal-month
- Required grain: accountability dimension
- Baseline join keys: cost-center
- Alignment policy: aggregate current to baseline grain
- Required currency: USD
- Required columns: report-period, cost-center, budget-cost, currency

1. Export the selected baseline version from Finance Approved Budget and preserve its version or as-of evidence.
2. Scope the exported baseline to AWS only. If the source contains multiple cloud providers, filter it with the authoritative provider field before aggregation, retain the filter evidence, and reject ambiguous or unattributed rows.
3. Produce a controlled input containing, at minimum, these columns: report-period, cost-center, budget-cost, currency.
4. Validate grain before any comparison. Aggregate current actual cost to these baseline keys before joining: cost-center. Require one baseline row per key and aligned period; reject duplicates.
5. Confirm all baseline cost values use USD. If conversion is needed, document and approve the FX source; this package performs no conversion.
6. Reconcile the AWS-only baseline total to its authoritative source and retain the reconciliation evidence.
7. Compare only at the validated common grain. Treat missing actual or baseline keys explicitly; do not silently coalesce unmatched rows.

### Forecast baseline

- Source reference: Cloud Finance Forecast
- Reference detail: fiscal-year-end as of 2026-08-01
- Required grain: accountability dimension
- Baseline join keys: cost-center
- Alignment policy: aggregate current to baseline grain
- Required currency: USD
- Required columns: report-period, cost-center, forecast-cost, currency

1. Export the selected baseline version from Cloud Finance Forecast and preserve its version or as-of evidence.
2. Scope the exported baseline to AWS only. If the source contains multiple cloud providers, filter it with the authoritative provider field before aggregation, retain the filter evidence, and reject ambiguous or unattributed rows.
3. Produce a controlled input containing, at minimum, these columns: report-period, cost-center, forecast-cost, currency.
4. Validate grain before any comparison. Aggregate current actual cost to these baseline keys before joining: cost-center. Require one baseline row per key and aligned period; reject duplicates.
5. Confirm all baseline cost values use USD. If conversion is needed, document and approve the FX source; this package performs no conversion.
6. Reconcile the AWS-only baseline total to its authoritative source and retain the reconciliation evidence.
7. Compare only at the validated common grain. Treat missing actual or baseline keys explicitly; do not silently coalesce unmatched rows.

## Additional data dependencies

Status: Manual source preparation and integration are required. No connector is configured, and this package performs no source or Cloudability write.

- Data domains: cmdb service catalog, business kpi
- Authoritative sources: Enterprise CMDB/service catalog and governed business KPI data product
- Logical join keys: application, reporting period
- Source grain: selected join keys
- Required refresh cadence: daily
- Accountable data owner role: Enterprise Data Product Owner

1. Confirm the named source systems, approved access path, and accountable data owner.
2. Define a controlled source extract containing the selected join keys, an aligned reporting period where applicable, and only the attributes or measures required by the report modules.
3. Profile join-key uniqueness, nulls, and coverage in both sources. Require one source row per selected join-key combination and aligned reporting period; reject duplicate combinations before joining.
4. Aggregate current cost to the confirmed source grain before combining data whenever the additional source is coarser than the Cloudability query.
5. Refresh and quality-check the source daily; verify that this cadence supports the report and any alert decisions.
6. Reconcile source totals where applicable, quantify unmatched keys, reject duplicates, and retain validation evidence.
7. Configure any connector or transfer only through a separately approved integration process; this design does not configure one.

## Comparison and variance calculations

- Current query group by: synthetic\_business\_mapping\_cost\_center, synthetic\_business\_mapping\_application, vendor, date
- Each baseline's join keys and alignment policy determine its safe comparison grain. Aggregate current actuals before comparison when the baseline is coarser than the current query.
- Prior-period time alignment comes from the selected period mode. Reporting period is excluded from direct equijoin keys because current and prior Cloudability date values differ.

| Baseline | Safe join keys | Alignment | Baseline metric | Variance amount | Variance percent | Zero-baseline policy |
|---|---|---|---|---|---|---|
| prior period | cost-center, application, cloud-provider | direct join | prior-period-cost | current-cost - baseline-cost | variance-amount / baseline-cost \* 100 | flag new spend and suppress percent |
| budget | cost-center | aggregate current to baseline grain | budget-cost | current-cost - baseline-cost | variance-amount / baseline-cost \* 100 | flag new spend and suppress percent |
| forecast | cost-center | aggregate current to baseline grain | forecast-cost | current-cost - baseline-cost | variance-amount / baseline-cost \* 100 | flag new spend and suppress percent |

## Materiality and response rule

- Trigger: variance percent &gt;= 10% OR variance amount &gt;= USD 20,000
- Across selected baselines: any
- Required response: approve corrective action
- Accountable role: Cloud Cost Owner
- Stop when: Close the review cycle when no result meets a materiality threshold, or every material result has one documented owner and disposition.

## Alert setup

Status: Requirement captured; manual configuration or a separately approved integration is required. This package has no alert or Cloudability write authority.

- Trigger modes: material exception, scheduled digest
- Desired channels: email, microsoft teams
- Recipient roles: report owner, finance leadership
- Digest cadence: weekly
- Event cooldown: 24 hours
- Event resolution rule: disposition recorded
- Event escalation: After 3 days to Cloud Finance Director

1. Resolve each recipient role to an approved distribution group or workflow owner outside this package.
2. Confirm that each desired channel is available and approved in the operating environment.
3. Translate the captured trigger into a tenant-validated manual rule or an approved external integration.
4. Define a stable event identity from the baseline and validated report keys so the cooldown suppresses only repeat notifications for the same unresolved item.
5. Suppress repeat alerts for 24 hours; record resolution only when a disposition is documented.
6. Apply the escalation requirement exactly as recorded: After 3 days to Cloud Finance Director.
7. Test with non-production recipients, document the observed trigger and delivery, and obtain approval before activation.
8. Keep configuration evidence with the report owner; do not treat this design artifact as proof of active alerting.

## Verification checklist

- [ ] Every metric, dimension, and filter binding was confirmed in the target tenant, including the exact AWS provider literal and exclusion of non-AWS rows.
- [ ] GET /v3/reporting/cost/run was tested as read-only in the target tenant, or remains clearly marked unexecuted.
- [ ] Current and prior-period results reconcile to an authoritative Cloudability cost total.
- [ ] Each external baseline was proven AWS-only, and its version, required columns, grain, currency, and source reconciliation were confirmed.
- [ ] Additional source authority, join keys, grain, cadence, owner, unmatched keys, duplicates, and reconciliation evidence were confirmed.
- [ ] Every module and baseline uses its own authoritative ranking plan.
- [ ] Every baseline calculation was tested with known examples, including zero and missing baseline values.
- [ ] Materiality, across-baseline behavior, response, owner, and stopping rule were tested.
- [ ] Alert setup was separately configured, tested, approved, and evidenced.
- [ ] Requested visual components and delivery formats were reviewed with the intended audience.
- [ ] No write occurred without explicit approval.

## Assumptions and limitations

- Saved-report creation capability is unverified; View writes are intentionally not enabled in this runtime, and this package performs no write.
- Cloudability UI labels, fields, and tenant bindings require confirmation in the target tenant.
- The target tenant must confirm that the bound provider field uses the exact AWS value before any query result is accepted.
- Generated read-query definitions have not been executed or reconciled against a target tenant.
- The private-beta MCP server is not an MVP dependency and remains unverified.
- Budget and forecast baselines are external manual inputs; native Cloudability ingestion, joining, and presentation are not assumed.
- Additional source integration is not configured; source access, join keys, grain, cadence, ownership, and reconciliation require manual validation.
- Alert requirements are captured for manual or separately approved integration setup; this package does not configure or send alerts.
