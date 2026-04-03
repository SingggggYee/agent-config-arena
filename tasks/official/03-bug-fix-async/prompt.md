# Fix Async Race Condition

## Objective

The file `src/queue.ts` implements an `AsyncQueue<T>` class. The test file `test/queue.test.ts` fails intermittently due to a race condition in the `dequeue` method. Find and fix the bug so the test passes reliably.

## Problem

When multiple `dequeue()` calls run concurrently, they can both observe `this.items.length > 0`, then both attempt to `shift()` the same item. This results in one caller receiving the item and the other receiving `undefined`.

## Requirements

1. **Fix the race condition** in `src/queue.ts` so that concurrent `dequeue()` calls never return the same item and never return `undefined` when items are available.
2. **Do not change the public API** of the `AsyncQueue` class (the `enqueue`, `dequeue`, and `size` signatures must remain the same).
3. **All tests must pass reliably.** The test is run 20 times in succession -- every run must pass.

## Hints

- The bug is in the `dequeue` method.
- The `await` between the length check and the `shift()` creates a window where another dequeue call can steal the item.
- A proper fix ensures that once a dequeue call claims an item, no other call can take it.
