import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const webDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(webDir, "..");

const sourceDir = path.join(webDir, ".next");
const targetDir = path.join(repoRoot, ".next");
const deterministicManifest = "routes-manifest-deterministic.json";
const classicManifest = "routes-manifest.json";

const srcDeterministic = path.join(sourceDir, deterministicManifest);
const srcClassic = path.join(sourceDir, classicManifest);

const srcManifest = fs.existsSync(srcDeterministic) ? srcDeterministic : srcClassic;
if (!fs.existsSync(srcManifest)) {
  console.warn(
    `[sync-root-next-manifest] no routes manifest found in ${sourceDir}`,
  );
  process.exit(0);
}

const dstDeterministic = path.join(targetDir, deterministicManifest);
const dstClassic = path.join(targetDir, classicManifest);

fs.mkdirSync(targetDir, { recursive: true });
// Always create deterministic manifest target, even if source only has classic.
fs.copyFileSync(srcManifest, dstDeterministic);

// Always keep classic manifest target too.
fs.copyFileSync(srcManifest, dstClassic);

console.log(
  `[sync-root-next-manifest] synced manifests to ${path.relative(repoRoot, dstDeterministic)} and ${path.relative(repoRoot, dstClassic)}`,
);

