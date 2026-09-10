import { readFile } from "node:fs/promises";

export async function loadLocalEnvironment(envPath) {
  try {
    const contents = await readFile(envPath, "utf8");
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
