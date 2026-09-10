import { readFile } from "node:fs/promises";

export function createCuratedContributionRepository(path) {
  let contributions;
  async function load() {
    if (!contributions) contributions = JSON.parse(await readFile(path, "utf8"));
    return contributions;
  }
  return {
    async byMemberId(memberId) {
      return (await load()).filter((entry) => entry.memberId === memberId);
    },
  };
}
