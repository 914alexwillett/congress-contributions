import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createServer } from "vite";

const root = resolve(import.meta.dirname, "..");
const vite = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });

try {
  const repository = await vite.ssrLoadModule("/src/services/curatedRepository.ts");
  const memberIds = repository.getSupportedConstituentAreas().flatMap((area) => area.memberIds);
  const contributions = [...new Map(memberIds.flatMap((memberId) => repository.getContributionsByMember(memberId)).map((entry) => [entry.id, entry])).values()];
  const outputPath = resolve(root, "data/generated/curated-contributions.json");
  await mkdir(resolve(root, "data/generated"), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(contributions, null, 2)}\n`);
  console.log(`Exported ${contributions.length} curated contributions for the API.`);
} finally {
  await vite.close();
}
