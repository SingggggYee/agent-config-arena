import { mkdtemp, cp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

export interface Sandbox {
  path: string;
}

export async function createSandbox(
  scaffoldPath: string,
  configContent: string,
  configFileName: string,
): Promise<Sandbox> {
  const sandboxPath = await mkdtemp(join(tmpdir(), "aca-"));

  await cp(scaffoldPath, sandboxPath, { recursive: true });
  await writeFile(join(sandboxPath, configFileName), configContent);

  return { path: sandboxPath };
}
