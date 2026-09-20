export type RecipientPersona = "executive";
export type PrimaryConcern = "cloud-cost-management";

export type ReportingGoal =
  | "spend-visibility"
  | "plan-performance"
  | "anomaly-management"
  | "accountability";

export type CurrentPeriod = "month-to-date" | "last-complete-month" | "quarter-to-date";
export type DecisionCadence = "weekly" | "monthly" | "quarterly";
export type ComparisonBaseline = "prior-period" | "budget" | "forecast";
export type PriorPeriodMode = "same-elapsed-period" | "full-prior-period";
export type PlanningPeriod =
  | "same-report-period"
  | "fiscal-month"
  | "fiscal-quarter"
  | "fiscal-year";
export type ForecastHorizon =
  | "month-end"
  | "quarter-end"
  | "fiscal-year-end"
  | "rolling-12-months";
export type BaselineGrain =
  | "organization-total"
  | "accountability-dimension"
  | "report-dimensions";

export type ScopeLevel = "organization" | "business-unit" | "cost-center";
export type AccountabilityDimension =
  | "cost-center"
  | "application"
  | "business-unit"
  | "cloud-account";
export type BreachAction =
  | "investigate"
  | "require-explanation"
  | "escalate"
  | "approve-corrective-action"
  | "approve-exception";
export type MaterialityMethod = "percentage" | "amount" | "both";
export type ThresholdCombination = "either" | "all";
export type BaselineBreachMode = "any" | "all";

export type PresentationMode = "recommended" | "custom";
export type PresentationComponent =
  | "kpi-summary"
  | "trend-line"
  | "baseline-comparison-chart"
  | "ranked-variance-chart"
  | "detailed-table";
export type TableDensity = "top-10" | "top-20" | "top-50" | "all-for-export";
export type DeliveryFormat =
  | "cloudability-view"
  | "csv-export"
  | "pdf-summary"
  | "json-specification";

export type AlertRequirementStatus = "requested" | "not-requested" | "deferred";
export type AlertMode = "material-exception" | "scheduled-digest";
export type AlertChannel = "email" | "slack" | "microsoft-teams" | "webhook-ticket";
export type AlertRecipientRole =
  | "report-owner"
  | "finance-leadership"
  | "engineering-leadership"
  | "custom-role";
export type AlertDigestCadence = "daily" | "weekly" | "monthly";
export type AlertCooldown = "none" | "4-hours" | "24-hours" | "7-days" | "not-specified";
export type AlertEscalationAfter = "4-hours" | "24-hours" | "3-days" | "7-days";

export type AdditionalDataStatus = "not-required" | "requested" | "deferred";
export type AdditionalDataDomain =
  | "cmdb-service-catalog"
  | "allocation-mapping"
  | "organizational-hierarchy"
  | "business-kpi"
  | "ticket-change-data"
  | "contract-rate-data"
  | "other";
export type AdditionalDataJoinKey =
  | "cloud-account"
  | "resource-id"
  | "application"
  | "cost-center"
  | "business-unit"
  | "reporting-period"
  | "custom";
export type AdditionalDataGrain =
  | "organization-total"
  | "selected-join-keys"
  | "mixed-or-unknown";
export type AdditionalDataRefreshCadence =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "on-demand";

export interface AdditionalDataRequirement {
  status: AdditionalDataStatus;
  domains?: AdditionalDataDomain[];
  sourceReferenceSummary?: string;
  joinKeys?: AdditionalDataJoinKey[];
  customJoinKey?: string;
  grain?: AdditionalDataGrain;
  refreshCadence?: AdditionalDataRefreshCadence;
  ownerRole?: string;
}

export type AlertEscalationPolicy =
  | { status: "not-requested" }
  | { status: "deferred" }
  | {
      status: "requested";
      after: AlertEscalationAfter;
      recipientRole: string;
    };

export interface EventAlertPolicy {
  cooldown: AlertCooldown;
  resolutionRule: "disposition-recorded";
  escalation: AlertEscalationPolicy;
}

export interface InterviewResponse {
  schemaVersion: "0.4.0";
  interviewId: string;
  recipientPersona: RecipientPersona;
  primaryConcern: PrimaryConcern;
  useCases: ReportingGoal[];
  leadUseCase: ReportingGoal;
  currentPeriod: CurrentPeriod;
  comparisonPlan?: {
    baselines: ComparisonBaseline[];
    priorPeriod?: { mode: PriorPeriodMode };
    budget?: {
      sourceRef: string;
      period: PlanningPeriod;
      grain: BaselineGrain;
    };
    forecast?: {
      sourceRef: string;
      horizon: ForecastHorizon;
      asOf: string;
      grain: BaselineGrain;
    };
    currency: string;
  };
  scope: {
    level: ScopeLevel;
    value?: string;
    accountabilityDimension: AccountabilityDimension;
  };
  additionalData: AdditionalDataRequirement;
  accountableOwnerRole?: string;
  anomalyManagement?: {
    materiality: ReportMateriality;
    breachAcrossBaselines: BaselineBreachMode;
    response: {
      action: BreachAction;
    };
  };
  presentation: {
    mode: PresentationMode;
    components: PresentationComponent[];
    tableDensity?: TableDensity;
    requestedFormats: DeliveryFormat[];
  };
  alerting: {
    status: AlertRequirementStatus;
    modes?: AlertMode[];
    channels?: AlertChannel[];
    recipientRoles?: AlertRecipientRole[];
    customRecipientRole?: string;
    digestCadence?: AlertDigestCadence;
    eventPolicy?: EventAlertPolicy;
  };
  governance: {
    reviewCadence: DecisionCadence;
  };
  notes?: string[];
}

export type ReportComparison =
  | { type: "prior-period"; mode: PriorPeriodMode }
  | {
      type: "budget";
      sourceRef: string;
      period: PlanningPeriod;
      grain: BaselineGrain;
      currency: string;
    }
  | {
      type: "forecast";
      sourceRef: string;
      horizon: ForecastHorizon;
      asOf: string;
      grain: BaselineGrain;
      currency: string;
    };

export interface ReportFilter {
  field: string;
  comparator: "==";
  values: string[];
}

export interface ReportMateriality {
  method: MaterialityMethod;
  percentage?: {
    metric: "variance-percent";
    operator: ">=";
    value: number;
  };
  amount?: {
    metric: "variance-amount";
    operator: ">=";
    value: number;
    currency: string;
  };
  combination?: ThresholdCombination;
}

export interface BaselineCalculationRule {
  baseline: ComparisonBaseline;
  joinKeys: string[];
  alignmentPolicy: "direct-join" | "aggregate-current-to-baseline-grain";
  comparisonCostMetric: string;
  varianceAmountMetric: string;
  variancePercentMetric: string;
  varianceAmountFormula: "current-cost - baseline-cost";
  variancePercentFormula: "variance-amount / baseline-cost * 100";
  zeroBaselinePolicy: "flag-new-spend-and-suppress-percent";
}

export type ReportModule =
  | "spend-overview"
  | "plan-comparison"
  | "cost-exceptions"
  | "accountability";

export type ReportRankingPlan =
  | {
      module: "spend-overview" | "accountability";
      sortField: "actual-cost";
      sortDirection: "desc";
      limit: number | null;
    }
  | {
      module: "plan-comparison" | "cost-exceptions";
      baseline: ComparisonBaseline;
      sortField: string;
      sortDirection: "desc";
      limit: number | null;
    };

export interface ReportContract {
  schemaVersion: "0.4.0";
  contractId: string;
  recipeId: "executive.cloud-cost-management.v2";
  title: string;
  recipientPersona: RecipientPersona;
  objectives: ReportingGoal[];
  leadObjective: ReportingGoal;
  modules: ReportModule[];
  businessQuestions: string[];
  decision: string;
  currentPeriod: CurrentPeriod;
  comparisons: ReportComparison[];
  scope: InterviewResponse["scope"];
  dataDependencies: InterviewResponse["additionalData"];
  accountableOwnerRole?: string;
  costBasis: "amortized-cost";
  logicalDimensions: string[];
  sourceMetrics: string[];
  derivedMetrics: string[];
  filters: ReportFilter[];
  rankingPlans: ReportRankingPlan[];
  sort: Array<{ field: string; direction: "desc" }>;
  rowLimit: number | null;
  presentation: InterviewResponse["presentation"];
  anomalyManagement?: InterviewResponse["anomalyManagement"];
  alertRequirements: InterviewResponse["alerting"];
  calculationRules: {
    currentGroupBy: string[];
    baselines: BaselineCalculationRule[];
  };
  governance: {
    reviewCadence: DecisionCadence;
    stoppingRule: string;
  };
  assumptions: string[];
  provenance: {
    interviewId: string;
    interviewVersion: "0.4.0";
    questionTreeVersion: "2.1.0";
    recipeVersion: "2.1.0";
    compilerVersion: "0.4.0";
  };
}

export interface TenantCapabilities {
  schemaVersion: "0.1.0";
  tenantId: string;
  mode: "synthetic" | "read-only" | "approved-view-write";
  dimensions: Record<string, string>;
  metrics: Record<string, string>;
  validatedFilterValues?: Record<string, string[]>;
  writePolicy: {
    allowViewWrites: boolean;
    requireApproval: true;
  };
}

export interface BoundFilter {
  field: string;
  comparator: "==";
  values: string[];
}

export interface BoundReport {
  contract: ReportContract;
  tenantId: string;
  dimensionBindings: Record<string, string>;
  metricBindings: Record<string, string>;
  dimensions: string[];
  sourceMetrics: string[];
  filters: BoundFilter[];
}

interface CloudabilityCostQueryDefinition {
  endpoint: "/v3/reporting/cost/run";
  method: "GET";
  readOnly: true;
  dimensions: string[];
  metrics: string[];
  filters: BoundFilter[];
}

export type CloudabilityCostQuery = CloudabilityCostQueryDefinition &
  (
    | {
        name: "current" | "trend";
        period: CurrentPeriod;
      }
    | {
        name: "prior-period";
        period: PriorPeriodMode;
      }
  );

export type ComparisonDataPlan =
  | {
      mode: "reporting-query";
      source: "prior-period";
      referenceDetail: PriorPeriodMode;
      joinKeys: string[];
      alignmentPolicy: "direct-join";
    }
  | {
      mode: "manual-reference";
      source: "budget" | "forecast";
      sourceRef: string;
      referenceDetail: string;
      grain: BaselineGrain;
      currency: string;
      requiredColumns: string[];
      joinKeys: string[];
      alignmentPolicy: "direct-join" | "aggregate-current-to-baseline-grain";
    };

export interface CloudabilityQueryPlan {
  readOnly: true;
  queries: CloudabilityCostQuery[];
  comparisonData: ComparisonDataPlan[];
  currentGroupBy: string[];
  derivedMetrics: string[];
  presentation: {
    components: PresentationComponent[];
    requestedFormats: DeliveryFormat[];
    rankingPlans: ReportRankingPlan[];
    sortField: string;
    sortDirection: "desc";
    limit: number | null;
  };
}

export type TraceStatus = "answered" | "skipped";
export type TraceOrigin = "user" | "default" | "derived";

export interface QuestionPathEntry {
  order: number;
  questionId: string;
  status: TraceStatus;
  evaluatedCondition: string;
  normalizedAnswer: string | number | string[] | null;
  origin: TraceOrigin;
  normalizationMethod?:
    | "direct-option"
    | "deterministic-alias"
    | "multi-option"
    | "text"
    | "number"
    | "date"
    | "currency";
}

export type BindingStatus = "confirmed" | "assumed" | "unsupported" | "tenant-unverified";

export interface CloudabilityDeploymentManifest {
  schemaVersion: "0.3.0";
  manifestId: string;
  contractId: string;
  target: {
    platform: "IBM Apptio Cloudability";
    edition: "tenant-unverified";
    capabilityProfileId: string;
  };
  delivery: {
    mode: "manual-assisted";
    designReady: true;
    manualBuildStatus: "tenant-validation-required" | "external-data-required" | "ready";
    automatedCreateStatus: "unverified";
    writeAuthority: "none";
  };
  bindings: {
    dimensions: Array<{ logicalName: string; platformName: string; status: BindingStatus }>;
    metrics: Array<{ logicalName: string; platformName: string; status: BindingStatus }>;
  };
  execution: {
    strategy:
      | "current-cost-only"
      | "read-query-comparison"
      | "manual-comparison"
      | "mixed-comparison";
    queryPlan: CloudabilityQueryPlan;
    calculations: ReportContract["calculationRules"];
  };
  viewPlan: {
    action: "preview-only";
    title: string;
    modules: ReportContract["modules"];
    components: PresentationComponent[];
    requestedFormats: DeliveryFormat[];
    filters: BoundFilter[];
    writeStatus: "disabled";
  };
  dataDependencyPlan: {
    requirement: InterviewResponse["additionalData"];
    configurationMode: "manual-required" | "not-required" | "decision-deferred";
    integrationStatus: "not-configured" | "not-required" | "decision-deferred";
    requiredValidation: string[];
    writeStatus: "disabled";
  };
  alertPlan: {
    status: AlertRequirementStatus;
    configurationMode: "manual-required" | "not-requested" | "decision-deferred";
    modes: AlertMode[];
    channels: AlertChannel[];
    recipientRoles: AlertRecipientRole[];
    digestCadence?: AlertDigestCadence;
    customRecipientRole?: string;
    eventPolicy?: EventAlertPolicy;
    writeStatus: "disabled";
  };
  limitations: string[];
  provenance: {
    contractId: string;
    rendererVersion: "2.1.0";
  };
}

export interface InterviewTrace {
  schemaVersion: "0.3.0";
  traceId: string;
  interviewId: string;
  contractId: string;
  recipeId: "executive.cloud-cost-management.v2";
  questionPath: QuestionPathEntry[];
  mappings: Array<{
    source: string;
    ruleId: string;
    targets: string[];
  }>;
}

export interface ValidationResults {
  schemaVersion: "0.3.0";
  validationId: string;
  contractId: string;
  overallStatus: "design-ready";
  readiness: {
    designComplete: true;
    queryDefinitionsGenerated: boolean;
    tenantBindingsConfirmed: boolean;
    comparisonInputsConfirmed: boolean;
    dataDependencyDefinitionComplete: boolean;
    dataDependencyInputsConfirmed: boolean;
    moduleRankingsGenerated: boolean;
    alertRequirementsComplete: boolean;
    executablePreview: boolean;
    manualBuildReady: boolean;
    automatedCreate: false;
    alertAutomation: false;
    viewWrite: false;
  };
  checks: Array<{
    id: string;
    status: "pass" | "warning" | "blocker";
    message: string;
  }>;
  findings: Array<{
    classification: "capability" | "tenant" | "governance" | "input";
    severity: "warning" | "blocker";
    message: string;
    affectedPath: string;
  }>;
  artifactHashes: Record<string, string>;
  packageHash: string;
  provenance: {
    rendererVersion: "2.1.0";
  };
}

export type OutputFileName =
  | "report-contract.json"
  | "cloudability-deployment-manifest.json"
  | "manual-build-guide.md"
  | "report-rationale.md"
  | "interview-trace.json"
  | "validation-results.json";

export type RenderedOutputPackage = Record<OutputFileName, string>;
