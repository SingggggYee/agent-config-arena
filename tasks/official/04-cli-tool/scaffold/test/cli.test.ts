import { describe, it, expect } from "vitest";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const CLI = resolve(import.meta.dirname, "../src/cli.ts");
const FIXTURE = resolve(import.meta.dirname, "fixtures/sample.json");

function run(args: string): { stdout: string; stderr: string; code: number } {
  try {
    const stdout = execSync(`node --import tsx/esm ${CLI} ${args}`, {
      encoding: "utf-8",
      cwd: resolve(import.meta.dirname, ".."),
      timeout: 10_000,
    });
    return { stdout: stdout.trimEnd(), stderr: "", code: 0 };
  } catch (err: any) {
    return {
      stdout: (err.stdout || "").trimEnd(),
      stderr: (err.stderr || "").trimEnd(),
      code: err.status ?? 1,
    };
  }
}

describe("CLI Tool", () => {
  it("1. basic dot access: name", () => {
    const result = run(`${FIXTURE} name`);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe("test");
  });

  it("2. nested path: data.count", () => {
    const result = run(`${FIXTURE} data.count`);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe("2");
  });

  it("3. array index: data.users[0]", () => {
    const result = run(`${FIXTURE} data.users[0]`);
    expect(result.code).toBe(0);
    const parsed = JSON.parse(result.stdout);
    expect(parsed).toEqual({ name: "Alice", age: 30 });
  });

  it("4. deep nested: data.users[0].name", () => {
    const result = run(`${FIXTURE} data.users[0].name`);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe("Alice");
  });

  it("5. --compact flag produces minified JSON", () => {
    const result = run(`${FIXTURE} data.users --compact`);
    expect(result.code).toBe(0);
    // Should be a single line with no extra whitespace
    expect(result.stdout).not.toContain("\n");
    const parsed = JSON.parse(result.stdout);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("Alice");
  });

  it("6. missing path returns undefined", () => {
    const result = run(`${FIXTURE} nonexistent.path`);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe("undefined");
  });

  it("7. missing file exits with error", () => {
    const result = run(`/tmp/this-file-does-not-exist-12345.json name`);
    expect(result.code).toBe(1);
  });

  it("8. --help shows usage text", () => {
    const result = run(`--help`);
    expect(result.code).toBe(0);
    expect(result.stdout.toLowerCase()).toContain("usage");
  });

  it("9. no arguments shows usage", () => {
    const result = run(``);
    expect(result.code).toBe(0);
    expect(result.stdout.toLowerCase()).toContain("usage");
  });

  it("10. non-existent deep path returns undefined", () => {
    const result = run(`${FIXTURE} data.users[99].name`);
    expect(result.code).toBe(0);
    expect(result.stdout).toBe("undefined");
  });
});
