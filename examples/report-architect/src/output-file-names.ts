import type { OutputFileName } from "./types.ts";

export const OUTPUT_FILE_NAMES = [
  "report-contract.json",
  "cloudability-deployment-manifest.json",
  "manual-build-guide.md",
  "report-rationale.md",
  "interview-trace.json",
  "validation-results.json"
] as const satisfies readonly OutputFileName[];

export const HASHED_ARTIFACT_FILE_NAMES = OUTPUT_FILE_NAMES.filter(
  (fileName): fileName is Exclude<OutputFileName, "validation-results.json"> =>
    fileName !== "validation-results.json"
);

export function outputFileNames(): OutputFileName[] {
  return [...OUTPUT_FILE_NAMES];
}
