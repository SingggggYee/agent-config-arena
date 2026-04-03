import { describe, it, expect } from "vitest";
import {
  capitalize,
  slugify,
  truncate,
  camelToKebab,
  kebabToCamel,
  countWords,
  formatDate,
  parseDate,
  daysUntil,
  isWeekend,
  addDays,
  startOfDay,
  clamp,
  roundTo,
  formatCurrency,
  percentage,
  randomInt,
  median,
} from "../src/utils.js";

describe("String Utilities", () => {
  it("capitalize: capitalizes the first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
    expect(capitalize("")).toBe("");
  });

  it("slugify: converts to URL-friendly slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  foo  BAR  baz  ")).toBe("foo-bar-baz");
  });

  it("truncate: truncates long strings with ellipsis", () => {
    expect(truncate("Hello, World!", 10)).toBe("Hello, ...");
    expect(truncate("Short", 10)).toBe("Short");
  });

  it("camelToKebab: converts camelCase to kebab-case", () => {
    expect(camelToKebab("backgroundColor")).toBe("background-color");
    expect(camelToKebab("fontSize")).toBe("font-size");
  });

  it("kebabToCamel: converts kebab-case to camelCase", () => {
    expect(kebabToCamel("background-color")).toBe("backgroundColor");
    expect(kebabToCamel("font-size")).toBe("fontSize");
  });

  it("countWords: counts words in a string", () => {
    expect(countWords("hello world")).toBe(2);
    expect(countWords("  ")).toBe(0);
    expect(countWords("one")).toBe(1);
  });
});

describe("Date Utilities", () => {
  it("formatDate: formats as YYYY-MM-DD", () => {
    expect(formatDate(new Date(2024, 0, 5))).toBe("2024-01-05");
    expect(formatDate(new Date(2024, 11, 25))).toBe("2024-12-25");
  });

  it("parseDate: parses YYYY-MM-DD string", () => {
    const d = parseDate("2024-03-15");
    expect(d.getFullYear()).toBe(2024);
    expect(d.getMonth()).toBe(2);
    expect(d.getDate()).toBe(15);
  });

  it("daysUntil: calculates days between dates", () => {
    const from = new Date(2024, 0, 1);
    const to = new Date(2024, 0, 10);
    expect(daysUntil(from, to)).toBe(9);
  });

  it("isWeekend: detects weekends", () => {
    expect(isWeekend(new Date(2024, 0, 6))).toBe(true); // Saturday
    expect(isWeekend(new Date(2024, 0, 8))).toBe(false); // Monday
  });

  it("addDays: adds days to a date", () => {
    const d = new Date(2024, 0, 1);
    const result = addDays(d, 5);
    expect(result.getDate()).toBe(6);
  });

  it("startOfDay: resets time to midnight", () => {
    const d = new Date(2024, 5, 15, 14, 30, 45);
    const result = startOfDay(d);
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });
});

describe("Number Utilities", () => {
  it("clamp: clamps value between min and max", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it("roundTo: rounds to specified decimals", () => {
    expect(roundTo(3.14159, 2)).toBe(3.14);
    expect(roundTo(3.145, 2)).toBe(3.15);
  });

  it("formatCurrency: formats as USD currency", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
    expect(formatCurrency(-42)).toBe("-$42.00");
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("percentage: calculates percentage", () => {
    expect(percentage(25, 100)).toBe(25);
    expect(percentage(1, 3)).toBeCloseTo(33.33, 1);
    expect(percentage(5, 0)).toBe(0);
  });

  it("randomInt: returns integer in range", () => {
    for (let i = 0; i < 50; i++) {
      const val = randomInt(1, 10);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
      expect(Number.isInteger(val)).toBe(true);
    }
  });

  it("median: calculates median correctly", () => {
    expect(median([1, 2, 3])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
    expect(median([])).toBe(0);
    expect(median([5])).toBe(5);
  });
});
