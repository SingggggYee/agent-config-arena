import { describe, it, expect } from "vitest";
import { TextIndex, SearchResult } from "../src/search.js";

describe("TextIndex", () => {
  it("should return matching documents for a basic search", () => {
    const index = new TextIndex();
    const results = index.search("machine learning");
    expect(results.length).toBeGreaterThan(0);
    // Should find docs about machine learning
    const ids = results.map((r) => r.id);
    expect(ids).toContain("doc-001");
    expect(ids).toContain("doc-006");
  });

  it("should rank documents with more matches higher", () => {
    const index = new TextIndex();
    const results = index.search("deep learning neural networks");
    expect(results.length).toBeGreaterThan(0);
    // doc-002 has "deep learning" and "neural networks" - should score high
    const topResult = results[0];
    expect(topResult.score).toBeGreaterThan(1);
  });

  it("should return empty array for empty query", () => {
    const index = new TextIndex();
    expect(index.search("")).toEqual([]);
    expect(index.search("   ")).toEqual([]);
  });

  it("should return empty array when no documents match", () => {
    const index = new TextIndex();
    const results = index.search("xyzzyplugh");
    expect(results).toEqual([]);
  });

  it("should be case insensitive", () => {
    const index = new TextIndex();
    const lowerResults = index.search("machine learning");
    const upperResults = index.search("Machine Learning");
    const mixedResults = index.search("MACHINE learning");
    expect(lowerResults.length).toBe(upperResults.length);
    expect(lowerResults.length).toBe(mixedResults.length);
    // Same documents should be found
    const lowerIds = lowerResults.map((r) => r.id).sort();
    const upperIds = upperResults.map((r) => r.id).sort();
    expect(lowerIds).toEqual(upperIds);
  });

  it("should handle multi-word queries and find partial matches", () => {
    const index = new TextIndex();
    const results = index.search("database optimization query");
    expect(results.length).toBeGreaterThan(0);
    // doc-008 has "Database optimization techniques and query performance tuning"
    const doc008 = results.find((r) => r.id === "doc-008");
    expect(doc008).toBeDefined();
    expect(doc008!.matches.length).toBeGreaterThanOrEqual(2);
  });

  it("should include matches array with matched terms", () => {
    const index = new TextIndex();
    const results = index.search("security");
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.matches.length).toBeGreaterThan(0);
    }
  });

  it("should return results sorted by score descending", () => {
    const index = new TextIndex();
    const results = index.search("learning algorithms");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("should find documents added after construction", () => {
    const index = new TextIndex();
    index.addDocument("custom-1", "unique zebra striped umbrella phenomenon");
    const results = index.search("zebra umbrella");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.id === "custom-1")).toBe(true);
  });

  it("should have correct SearchResult shape", () => {
    const index = new TextIndex();
    const results = index.search("computing");
    expect(results.length).toBeGreaterThan(0);
    const result = results[0];
    expect(typeof result.id).toBe("string");
    expect(typeof result.score).toBe("number");
    expect(Array.isArray(result.matches)).toBe(true);
  });
});
