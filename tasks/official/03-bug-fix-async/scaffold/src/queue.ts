/**
 * An async queue that supports blocking dequeue.
 *
 * If items are available, dequeue() returns immediately.
 * If the queue is empty, dequeue() blocks until an item is enqueued.
 */
export class AsyncQueue<T> {
  private items: T[] = [];
  private waiting: Array<(value: T) => void> = [];

  /**
   * Add an item to the queue. If there are pending dequeue calls waiting,
   * the first one receives the item directly.
   */
  enqueue(item: T): void {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift()!;
      resolve(item);
    } else {
      this.items.push(item);
    }
  }

  /**
   * Remove and return the next item from the queue.
   * If the queue is empty, this returns a promise that resolves when
   * an item becomes available.
   *
   * BUG: There is a race condition here. Can you find and fix it?
   */
  async dequeue(): Promise<T> {
    if (this.items.length > 0) {
      // Simulate async bookkeeping (e.g., logging, metrics).
      // RACE CONDITION: This yield allows other dequeue() calls that were
      // started concurrently to also pass the length check above.
      // After the yield, multiple callers all try to shift() the same item.
      await Promise.resolve();
      return this.items.shift()!;
    }

    return new Promise<T>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  /**
   * The number of items currently in the queue.
   */
  get size(): number {
    return this.items.length;
  }
}
