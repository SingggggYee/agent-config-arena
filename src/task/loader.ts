import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import type { Task, TaskMeta } from "./types.js";

export async function loadTasks(tasksDir: string): Promise<Task[]> {
  const entries = await readdir(tasksDir, { withFileTypes: true });
  const tasks: Task[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith(".")) continue;

    const dir = join(tasksDir, entry.name);
    const metaPath = join(dir, "meta.json");

    try {
      await access(metaPath);
    } catch {
      continue;
    }

    const metaContent = await readFile(metaPath, "utf-8");
    const meta: TaskMeta = JSON.parse(metaContent);

    tasks.push({
      id: meta.id,
      meta,
      promptPath: join(dir, "prompt.md"),
      testPath: join(dir, "test.sh"),
      scaffoldPath: join(dir, "scaffold"),
      dir,
    });
  }

  return tasks.sort((a, b) => a.id.localeCompare(b.id));
}
