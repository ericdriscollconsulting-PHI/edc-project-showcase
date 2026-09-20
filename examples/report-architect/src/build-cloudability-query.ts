import type {
  BoundReport,
  CloudabilityCostQuery,
  CloudabilityQueryPlan,
  ComparisonDataPlan,
  ReportComparison
} from "./types.ts";

function unique(values: readonly string[]): string[] {
  return [...new Set(values)];
}

function manualRequiredColumns(
  comparison: Extract<ReportComparison, { type: "budget" | "forecast" }>,
  joinKeys: string[]
): string[] {
  return unique(["report-period", ...joinKeys, `${comparison.type}-cost`, "currency"]);
}

function bindJoinKeys(bound: BoundReport, logicalNames: string[]): string[] {
  return logicalNames.map((logicalName) => {
    const platformName = bound.dimensionBindings[logicalName];
    if (!platformName) {
      throw new Error(`Bound report is missing calculation dimension: ${logicalName}`);
    }
    return platformName;
  });
}

function comparisonDataPlan(
  bound: BoundReport,
  comparison: ReportComparison
): ComparisonDataPlan {
  const calculation = bound.contract.calculationRules.baselines.find(
    (candidate) => candidate.baseline === comparison.type
  );
  if (!calculation) {
    throw new Error(`Report contract is missing calculation rules for: ${comparison.type}`);
  }
  const joinKeys = bindJoinKeys(bound, calculation.joinKeys);

  if (comparison.type === "prior-period") {
    if (calculation.alignmentPolicy !== "direct-join") {
      throw new Error("Prior-period comparison must use a direct join");
    }
    return {
      mode: "reporting-query",
      source: "prior-period",
      referenceDetail: comparison.mode,
      joinKeys,
      alignmentPolicy: "direct-join"
    };
  }

  return {
    mode: "manual-reference",
    source: comparison.type,
    sourceRef: comparison.sourceRef,
    referenceDetail:
      comparison.type === "budget"
        ? comparison.period
        : `${comparison.horizon} as of ${comparison.asOf}`,
    grain: comparison.grain,
    currency: comparison.currency,
    requiredColumns: manualRequiredColumns(comparison, calculation.joinKeys),
    joinKeys,
    alignmentPolicy: calculation.alignmentPolicy
  };
}

export function buildCloudabilityQueryPlan(bound: BoundReport): CloudabilityQueryPlan {
  const [sortRule] = bound.contract.sort;
  if (!sortRule) throw new Error("Report contract requires one deterministic sort rule");
  const currentGroupBy = bindJoinKeys(
    bound,
    bound.contract.calculationRules.currentGroupBy
  );

  const current: CloudabilityCostQuery = {
    name: "current",
    endpoint: "/v3/reporting/cost/run",
    method: "GET",
    readOnly: true,
    period: bound.contract.currentPeriod,
    dimensions: [...currentGroupBy],
    metrics: [...bound.sourceMetrics],
    filters: structuredClone(bound.filters)
  };
  const queries: CloudabilityCostQuery[] = [current];
  const priorPeriod = bound.contract.comparisons.find(
    (comparison): comparison is Extract<ReportComparison, { type: "prior-period" }> =>
      comparison.type === "prior-period"
  );

  if (priorPeriod) {
    queries.push({
      ...structuredClone(current),
      name: "prior-period",
      period: priorPeriod.mode
    });
  }

  if (bound.contract.presentation.components.includes("trend-line")) {
    queries.push({
      name: "trend",
      endpoint: "/v3/reporting/cost/run",
      method: "GET",
      readOnly: true,
      period: bound.contract.currentPeriod,
      dimensions: bindJoinKeys(bound, ["reporting-period"]),
      metrics: [...bound.sourceMetrics],
      filters: structuredClone(bound.filters)
    });
  }

  return {
    readOnly: true,
    queries,
    comparisonData: bound.contract.comparisons.map((comparison) =>
      comparisonDataPlan(bound, comparison)
    ),
    currentGroupBy,
    derivedMetrics: [...bound.contract.derivedMetrics],
    presentation: {
      components: [...bound.contract.presentation.components],
      requestedFormats: [...bound.contract.presentation.requestedFormats],
      rankingPlans: structuredClone(bound.contract.rankingPlans),
      sortField: sortRule.field,
      sortDirection: sortRule.direction,
      limit: bound.contract.rowLimit
    }
  };
}
