import type { BoundReport, ReportContract, TenantCapabilities } from "./types.ts";

export function requiredDimensionNames(contract: ReportContract): string[] {
  return [
    ...new Set([
      ...contract.logicalDimensions,
      ...contract.calculationRules.currentGroupBy,
      ...contract.calculationRules.baselines.flatMap((rule) => rule.joinKeys),
      ...contract.filters.map((filter) => filter.field),
      ...(contract.presentation.components.includes("trend-line")
        ? ["reporting-period"]
        : [])
    ])
  ];
}

function resolveBindings(
  kind: "dimension" | "metric",
  logicalNames: string[],
  available: Record<string, string>
): void {
  const missing = logicalNames.filter((name) => !available[name]);
  if (missing.length > 0) {
    throw new Error(`Tenant is missing required ${kind} bindings: ${missing.join(", ")}`);
  }
}

export function bindTenant(contract: ReportContract, tenant: TenantCapabilities): BoundReport {
  const requiredDimensions = requiredDimensionNames(contract);
  resolveBindings("dimension", requiredDimensions, tenant.dimensions);
  resolveBindings("metric", contract.sourceMetrics, tenant.metrics);

  const dimensionBindings = Object.fromEntries(
    requiredDimensions.map((name) => [name, tenant.dimensions[name]])
  );
  const metricBindings = Object.fromEntries(
    contract.sourceMetrics.map((name) => [name, tenant.metrics[name]])
  );

  return {
    contract,
    tenantId: tenant.tenantId,
    dimensionBindings,
    metricBindings,
    dimensions: contract.logicalDimensions.map((name) => tenant.dimensions[name]),
    sourceMetrics: contract.sourceMetrics.map((name) => tenant.metrics[name]),
    filters: contract.filters.map((filter) => ({
      field: tenant.dimensions[filter.field],
      comparator: filter.comparator,
      values: [...filter.values]
    }))
  };
}
