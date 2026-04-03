import { readdir, readFile, stat } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import type { Config, ConfigMeta } from "./types.js";

function parseFrontmatter(content: string): {
  meta: Partial<ConfigMeta>;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta: Partial<ConfigMeta> = {};
  const lines = match[1].split("\n");
  for (const line of lines) {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (key && value) {
      (meta as Record<string, string>)[key.trim()] = value;
    }
  }

  return { meta, body: match[2] };
}

export async function loadConfig(filePath: string): Promise<Config> {
  const content = await readFile(filePath, "utf-8");
  const { meta } = parseFrontmatter(content);
  const id = basename(filePath, extname(filePath));

  return {
    id,
    meta: {
      name: meta.name || id,
      author: meta.author,
      description: meta.description,
      tier: filePath.includes("/community/") ? "community" : "official",
    },
    filePath,
    content,
  };
}

export async function loadConfigs(configsDir: string): Promise<Config[]> {
  const configs: Config[] = [];

  for (const tier of ["official", "community"]) {
    const tierDir = join(configsDir, tier);
    let entries: string[];
    try {
      entries = await readdir(tierDir);
    } catch {
      continue;
    }

    for (const name of entries) {
      if (!name.endsWith(".md")) continue;
      const config = await loadConfig(join(tierDir, name));
      configs.push(config);
    }
  }

  return configs.sort((a, b) => a.id.localeCompare(b.id));
}
