import { describe, it, expect } from "vitest";
import { AsyncQueue } from "../src/queue.js";

describe("AsyncQueue", () => {
  it("basic enqueue and dequeue", async () => {
    const q = new AsyncQueue<number>();
    q.enqueue(1);
    q.enqueue(2);
    expect(await q.dequeue()).toBe(1);
    expect(await q.dequeue()).toBe(2);
  });

  it("dequeue blocks until enqueue", async () => {
    const q = new AsyncQueue<string>();
    const promise = q.dequeue();
    // Queue is empty, dequeue should be waiting
    expect(q.size).toBe(0);
    q.enqueue("hello");
    expect(await promise).toBe("hello");
  });

  it("size reflects current item count", () => {
    const q = new AsyncQueue<number>();
    expect(q.size).toBe(0);
    q.enqueue(10);
    q.enqueue(20);
    expect(q.size).toBe(2);
  });

  it("multiple waiters resolved in order", async () => {
    const q = new AsyncQueue<number>();
    const p1 = q.dequeue();
    const p2 = q.dequeue();
    const p3 = q.dequeue();
    q.enqueue(1);
    q.enqueue(2);
    q.enqueue(3);
    expect(await p1).toBe(1);
    expect(await p2).toBe(2);
    expect(await p3).toBe(3);
  });

  it("concurrent dequeue does not return duplicates or undefined", async () => {
    // This test exposes the race condition.
    // We enqueue ONE item, then start TWO concurrent dequeue calls.
    // With the bug, both calls see items.length > 0, both await,
    // then the first shift() gets the item and the second gets undefined.
    const q = new AsyncQueue<number>();

    // Enqueue a single item
    q.enqueue(42);

    // Start two concurrent dequeue calls
    const p1 = q.dequeue();
    const p2 = q.dequeue();

    // The second dequeue should block (queue is empty after first takes the item).
    // Resolve it by enqueuing another item.
    // Give microtasks time to settle, then enqueue.
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    q.enqueue(99);

    const [v1, v2] = await Promise.all([p1, p2]);

    // Both values must be defined numbers
    expect(v1).toBeTypeOf("number");
    expect(v2).toBeTypeOf("number");
    expect(v1).not.toBeNaN();
    expect(v2).not.toBeNaN();

    // They must be different (no duplicate consumption)
    expect(v1).not.toBe(v2);

    // They must be the values we enqueued
    const sorted = [v1, v2].sort((a, b) => a - b);
    expect(sorted).toEqual([42, 99]);
  });

  it("many concurrent dequeues return all unique values", async () => {
    const q = new AsyncQueue<number>();
    const count = 50;

    // Enqueue items one at a time, interleaved with dequeue calls
    // to maximize race condition window
    for (let i = 0; i < count; i++) {
      q.enqueue(i);
    }

    // Fire all dequeue calls at once
    const promises = Array.from({ length: count }, () => q.dequeue());
    const results = await Promise.all(promises);

    // No value should be undefined
    for (const r of results) {
      expect(r).not.toBeUndefined();
      expect(typeof r).toBe("number");
    }

    // All values must be unique
    const unique = new Set(results);
    expect(unique.size).toBe(count);
  });

  it("mixed concurrent enqueue and dequeue", async () => {
    const q = new AsyncQueue<number>();

    // Start 5 dequeues that will block
    const promises = Array.from({ length: 5 }, () => q.dequeue());

    // Enqueue 5 items with slight delays
    for (let i = 0; i < 5; i++) {
      await new Promise<void>((r) => setTimeout(r, 1));
      q.enqueue(i * 10);
    }

    const values = await Promise.all(promises);
    expect(values).toEqual([0, 10, 20, 30, 40]);
  });
});
