import { createHash } from "node:crypto";

import {
  HASHED_ARTIFACT_FILE_NAMES,
  OUTPUT_FILE_NAMES
} from "./output-file-names.ts";
import type { ValidationResults } from "./types.ts";

export const PACKAGE_HASH_PLACEHOLDER = "0".repeat(64);

const SHA256_PATTERN = /^[a-f0-9]{64}$/;

export interface PackageIdentity {
  packageHash: string;
  contractId: string;
  interviewId: string;
}

export class PackageIntegrityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PackageIntegrityError";
  }
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, normalize(nested)])
    );
  }
  return value;
}

export function renderCanonicalJson(value: unknown): string {
  return `${JSON.stringify(normalize(value), null, 2)}\n`;
}

export function hashText(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function fail(message: string): never {
  throw new PackageIntegrityError(message);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (!isRecord(value)) fail(`${label} must be an object`);
  return value;
}

function requireString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) fail(`${label} must be a string`);
  return value;
}

function parseJsonFile(files: Record<string, string>, fileName: string): Record<string, unknown> {
  let value: unknown;
  try {
    value = JSON.parse(files[fileName] ?? "");
  } catch {
    fail(`${fileName} must be valid JSON`);
  }
  return requireRecord(value, fileName);
}

function assertExactNames(actual: readonly string[], expected: readonly string[], label: string): void {
  const left = [...actual].sort();
  const right = [...expected].sort();
  if (JSON.stringify(left) !== JSON.stringify(right)) {
    fail(`${label} must contain the exact governed file set`);
  }
}

function assertArtifactHashes(value: unknown): Record<string, string> {
  const hashes = requireRecord(value, "validation-results.json artifactHashes");
  assertExactNames(
    Object.keys(hashes),
    HASHED_ARTIFACT_FILE_NAMES,
    "validation-results.json artifactHashes"
  );
  for (const fileName of HASHED_ARTIFACT_FILE_NAMES) {
    if (typeof hashes[fileName] !== "string" || !SHA256_PATTERN.test(hashes[fileName])) {
      fail(`validation-results.json artifactHashes.${fileName} must be SHA-256`);
    }
  }
  return hashes as Record<string, string>;
}

function hashManifest(hashes: Record<string, string>): string {
  return hashText(
    Object.entries(hashes)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([fileName, hash]) => `${fileName}:${hash}`)
      .join("\n")
  );
}

/**
 * Compute the governed six-file identity. The validation artifact is hashed in
 * canonical form with its packageHash replaced by a fixed placeholder, avoiding
 * an impossible self-referential digest while binding every other validation byte.
 */
export function computePackageHash(
  artifactHashes: Record<string, string>,
  validation: ValidationResults
): string {
  const checkedArtifactHashes = assertArtifactHashes(artifactHashes);
  const normalizedValidation = renderCanonicalJson({
    ...validation,
    packageHash: PACKAGE_HASH_PLACEHOLDER
  });
  return hashManifest({
    ...checkedArtifactHashes,
    "validation-results.json": hashText(normalizedValidation)
  });
}

/** Verify byte integrity and cross-file identity before a package is consumed. */
export function verifyPackageIntegrity(
  files: Record<string, string>,
  expectedInterviewId?: string
): PackageIdentity {
  assertExactNames(Object.keys(files), OUTPUT_FILE_NAMES, "Output package");
  for (const fileName of OUTPUT_FILE_NAMES) {
    if (typeof files[fileName] !== "string") fail(`${fileName} must be text`);
  }

  const validation = parseJsonFile(files, "validation-results.json");
  if (renderCanonicalJson(validation) !== files["validation-results.json"]) {
    fail("validation-results.json must use canonical JSON encoding");
  }
  const claimedPackageHash = validation.packageHash;
  if (typeof claimedPackageHash !== "string" || !SHA256_PATTERN.test(claimedPackageHash)) {
    fail("validation-results.json packageHash must be SHA-256");
  }
  const artifactHashes = assertArtifactHashes(validation.artifactHashes);
  for (const fileName of HASHED_ARTIFACT_FILE_NAMES) {
    if (hashText(files[fileName]) !== artifactHashes[fileName]) {
      fail(`${fileName} does not match its recorded artifact hash`);
    }
  }
  const computedPackageHash = computePackageHash(
    artifactHashes,
    validation as unknown as ValidationResults
  );
  if (claimedPackageHash !== computedPackageHash) {
    fail("Output package does not match its recorded package hash");
  }

  const contract = parseJsonFile(files, "report-contract.json");
  const manifest = parseJsonFile(files, "cloudability-deployment-manifest.json");
  const trace = parseJsonFile(files, "interview-trace.json");
  const contractProvenance = requireRecord(contract.provenance, "report-contract.json provenance");
  const manifestProvenance = requireRecord(
    manifest.provenance,
    "cloudability-deployment-manifest.json provenance"
  );
  const contractId = requireString(contract.contractId, "report-contract.json contractId");
  const interviewId = requireString(
    contractProvenance.interviewId,
    "report-contract.json provenance.interviewId"
  );

  const contractIds = [
    manifest.contractId,
    manifestProvenance.contractId,
    trace.contractId,
    validation.contractId
  ];
  if (contractIds.some((candidate) => candidate !== contractId)) {
    fail("Output package contract identity is inconsistent");
  }
  if (trace.interviewId !== interviewId) {
    fail("Output package interview identity is inconsistent");
  }
  if (expectedInterviewId !== undefined && interviewId !== expectedInterviewId) {
    fail("Output package does not belong to the requested interview");
  }

  return { packageHash: claimedPackageHash, contractId, interviewId };
}
